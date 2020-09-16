import csv


def writeData(data=[], urlName='test'):
    list_data = []
    header = []
    for item in data:
        if (len(header) == 0):
            header = item.keys()
        else:
            list_data.append([item[key] for key in header])

    csv_open_file = open(r'./data/' + urlName + '.csv',
                         mode='w',
                         encoding='utf8',
                         newline='')
    csv_w_file = csv.writer(csv_open_file, dialect='excel')
    csv_w_file.writerow(header)
    csv_w_file.writerows(list_data)
    csv_open_file.close()
    return
