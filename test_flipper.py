# Takes a test (defined below) and builds the other 7 symmetrical tests
# To automate rotation, the test needs to fit within a 10x10. The program checks for this, and can shift the snake to match.

snake = [[7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [6, 6], [5, 6], [4, 6], [3, 6], [3, 5], [3, 4], [3, 3], [3, 2], [3, 1], [3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2]];
dir = 'up';
food = [-10, -10];

# Used only for naming the functions
base_scenario = 25

# Step 1: Scale down to fit into a 10x10. Errors if not possible.

if food == [-10, -10]:
	min_x = 15
	max_x = 0
else:
	min_x = food[0]
	max_x = food[0]

for s in snake:
	if s[0] < min_x:
		min_x = s[0]
	if s[0] > max_x:
		max_x = s[0]
if max_x > min_x + 10:
	raise IndexError('Snake too wide')

if max_x > 9:
	for s in snake:
		s[0] -= (max_x-9)
	if food != [-10, -10]:
		food[0] -= (max_x-9)

rotate_order = ['up', 'right', 'down', 'left']
flip = {'up':'down', 'down':'up', 'left':'right', 'right':'left'}

# Rotate 0 CC (but is re-spaced)
print 'function scenario%d() {' % base_scenario
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (s[0], s[1])
print out[:-2]+'];'
print '\tdir = \'%s\';' % dir
print '\tfood = [%d, %d];' % (food[0], food[1])
print '}'

# Rotate 0 CC, flipped
print 'function scenario%d() {' % (base_scenario+1)
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (9-s[0], s[1])
print out[:-2]+'];'
print '\tdir = \'%s\';' % dir
if food == [-10, -10]:
	print '\tfood = [-10, -10];'
else:
	print '\tfood = [%d, %d];' % (9-food[0], food[1])
print '}'

# Rotate 90 CC
print 'function scenario%d() {' % (base_scenario+2)
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (9-s[1], s[0])
print out[:-2]+'];'
index = rotate_order.index(dir)
print '\tdir = \'%s\';' % rotate_order[(index+1)%4]
if food == [-10, -10]:
	print '\tfood = [-10, -10];'
else:
	print '\tfood = [%d, %d];' % (9-food[1], food[0])
print '}'

# Rotate 90 CC, flipped
print 'function scenario%d() {' % (base_scenario+3)
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (9-s[1], 9-s[0])
print out[:-2]+'];'
index = rotate_order.index(dir)
print '\tdir = \'%s\';' % rotate_order[(index+1)%4]
if food == [-10, -10]:
	print '\tfood = [-10, -10];'
else:
	print '\tfood = [%d, %d];' % (9-food[1], 9-food[0])
print '}'

# Rotate 180 CC
print 'function scenario%d() {' % (base_scenario+4)
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (9-s[0], 9-s[1])
print out[:-2]+'];'
index = rotate_order.index(dir)
print '\tdir = \'%s\';' % rotate_order[(index+2)%4]
if food == [-10, -10]:
	print '\tfood = [-10, -10];'
else:
	print '\tfood = [%d, %d];' % (9-food[0], 9-food[1])
print '}'

# Rotate 180 CC, flipped
print 'function scenario%d() {' % (base_scenario+5)
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (s[0], 9-s[1])
print out[:-2]+'];'
index = rotate_order.index(dir)
print '\tdir = \'%s\';' % rotate_order[(index+2)%4]
if food == [-10, -10]:
	print '\tfood = [-10, -10];'
else:
	print '\tfood = [%d, %d];' % (food[0], 9-food[1])
print '}'

# Rotate 270 CC
print 'function scenario%d() {' % (base_scenario+6)
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (s[1], 9-s[0])
print out[:-2]+'];'
index = rotate_order.index(dir)
print '\tdir = \'%s\';' % rotate_order[(index+3)%4]
if food == [-10, -10]:
	print '\tfood = [-10, -10];'
else:
	print '\tfood = [%d, %d];' % (food[1], 9-food[0])
print '}'

# Rotate 270 CC, flipped
print 'function scenario%d() {' % (base_scenario+7)
out = '\tsnake = ['
for s in snake:
	out += '[%d, %d], ' % (s[1], s[0])
print out[:-2]+'];'
index = rotate_order.index(dir)
print '\tdir = \'%s\';' % rotate_order[(index+3)%4]
if food == [-10, -10]:
	print '\tfood = [-10, -10];'
else:
	print '\tfood = [%d, %d];' % (food[1], food[0])
print '}'

