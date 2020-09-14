# coding:utf-8
import csv


def getData(urlName):
    csv_file = open(r'./data/' + urlName + '.csv', mode='r', encoding='utf-8')
    csv_data = csv.reader(csv_file)
    csv_dict = []
    header = []
    for i in csv_data:
        if (len(header) == 0):
            header = i
        else:
            obj = {}
            for j in range(len(header)):
                obj[header[j]] = i[j]
            csv_dict.append(obj)
    csv_file.close()
    return csv_dict
