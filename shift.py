snake = [[7, 2], [6, 2], [5, 2], [4, 2], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [9, 7], [9, 8], [9, 9], [8, 9], [7, 9], [6, 9]];
dir = 'right';
food = [-10, -10];



shift = [5, 0]

for s in snake:
	s[0] += shift[0]
	s[1] += shift[1]

if food != [-10, -10]:
	food[0] += shift[0]
	food[1] += shift[1]

out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (s[0], s[1])
print out[:-2]+'];'
print '\tdir = \'%s\';' % dir
print '\tfood = [%d, %d];' % (food[0], food[1])
