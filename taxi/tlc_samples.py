import luigi
import os
import subprocess
import logging
import sys
from collections import defaultdict
import json
import re
import csv
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import Polygon, Point, shape
from rtree import index
import fiona
import geopandas as gpd


download_url = "https://s3.amazonaws.com/nyc-tlc/trip+data/{color}_tripdata_"\
               "{year:%Y}-{month:%m}.csv"

def get_logger(name):
    '''
    Obtain a logger outputing to stderr with specified name. Defaults to INFO
    log level.
    '''
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter('%(asctime)-15s %(message)s'))
    logger.addHandler(handler)
    return logger

LOGGER = get_logger(__name__)

def shell(cmd):
    '''
    Run a shell command, uses :py:func:`subprocess.check_output(cmd,
    shell=True)` under the hood.

    Returns the ``STDOUT`` output, and raises an error if there is a
    none-zero exit code.
    '''
    try:
        return subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT)
    except subprocess.CalledProcessError as err:
        LOGGER.error(err.output)
        raise

class DownloadDataByDate(luigi.Task):
    '''
    Download by year and month as date string (formatted YYYY-MM)
    and by taxi color (green or yellow)
    '''

    date = luigi.MonthParameter()
    taxi_color = luigi.Parameter(default='yellow')

    def output(self):
        return luigi.LocalTarget('tmp/taxi_{color}.{date}.csv'
                    .format(date=self.date, color=self.taxi_color))

    def download(self):
        url = download_url.format(color=self.taxi_color, year=self.date, month=self.date)
        shell('wget -P {output} {url}'.format(
           output=self.output().path,
           url=url
        ))

    def run(self):
        try:
            self.output().makedirs()
            self.download()
        except Exception as err:
            os.remove(self.output().path)
            raise

class SpatialJoin(luigi.Task):
    '''
    Necessary for taxi data with latitude and longitudes and no zones
    '''
    date = luigi.MonthParameter()
    taxi_color = luigi.Parameter(default='yellow')

    def output(self):
        return luigi.LocalTarget("data/neighborhood_hour_aggregated.csv")

    def requires(self):
        return DownloadDataByDate(self.date, self.taxi_color)

    def run(self):
        self.output().makedirs()

        taxi_zone_shapefile = gpd.read_file("taxi_zones/taxi_zones.shp")
        taxi_zones = list(taxi_zone_shapefile.geometry)
        downloaded_data = self.input().path
        #fix this later
        taxi_data = pd.read_csv(downloaded_data+'/{color}_tripdata_2015-05.csv'.format(color=self.taxi_color))
        points = [Point(xy) for xy in zip(taxi_data.pickup_longitude, taxi_data.pickup_latitude)]
        # Populate R-tree index with bounds of polygons
        idx = index.Index()
        for pos, poly in enumerate(taxi_zones):
            idx.insert(pos, poly.bounds)
        # Query each point to see which polygon it is in
        # using first Rtree index, then Shapely geometry's within
        for point in points[:100]:
            poly_idx = [i for i in idx.intersection((point.coords[0]))
                        if point.within(taxi_zones[i])]
            for num, idx in enumerate(poly_idx, 1):
                print("%d:%d:%s" % (num, idx, taxi_zones[idx]))

class CountByNeighborhoodHour(luigi.Task):
    '''
    Task to count drop offs and pickups by neighborhood, by hour
    '''

    def output(self):
        return luigi.LocalTarget("data/neighborhood_hour_aggregated.csv")

    def requires(self):
        return DownloadDataByDate()

    def run(self):
        year_count = []
        valid_user_list = []
        valid_search = []
        for input in self.input():
            with input.open('r') as in_file:
                for line in in_file:
                    user, searches = line.strip().split(',', 1)
                    searches = searches.strip().replace('"', '')
                    searches_split = searches.split(r'\\n-')[1:]
                    for search in searches_split:
                        search_split = re.split(' \:(.*?)\:', search)[1:]
                        values = [i.replace(' ', '').replace(r'\\n', '') for i in search_split[1::2]]
                        attr_dict = dict(zip(search_split[0::2], values))
                        if 'clicks' in attr_dict and 'search_id' in attr_dict and 'created_at' in attr_dict and int(attr_dict['clicks']) >= self.clicks:
                            try:
                                date = regex_parse_date(str(attr_dict['created_at']))
                                date_count.append((date, 1))
                                valid_user_list.append((date, user))
                                valid_search.append((attr_dict['search_id'],attr_dict['criteria'],attr_dict['clicks']))
                            except:
                                # print(attr_dict['created_at'])
                                pass

        date_counter = defaultdict(int)
        for day, count in date_count:
            date_counter[day] += count

        d = defaultdict(list)
        for k, v in valid_user_list:
            d[k].append(v)

        final_count = {}
        for day, users in d.items():
            final_count[day] = []
            final_count[day].append(len(set(users)))

        for day, count in date_counter.items():
            final_count[day].append(count)

        with self.output()[0].open('w') as out_file:
            writer = csv.writer(out_file)
            for key, value in final_count.items():
                writer.writerow([key, value[0], value[1]])

        # Could be it's own task, but OK for now...
        with self.output()[1].open('w') as csv_file:
            for i in valid_search:
                csv_file.write("{}\t{}\t{}\n".format(i[0], i[1], i[2]))
