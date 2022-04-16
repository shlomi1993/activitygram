# f = open('interestsOld.csv', 'r')
# interests = f.readlines()
# f.close()
#
# f = open('interests.csv', 'w')
# for i, line in zip(range(len(interests)), interests):
#     line_s = line.split(',')
#     if line_s[2] == 'title':
#         f.write(line)
#         continue
#     line_s[2] = 'interest' + str(i)
#     line_s = ','.join(line_s)
#     f.write(line_s)
# f.close()