def priority(s):
  i = ord(s)
  return i - (96 if (i > 96) else 38)

def overlaps(sets):
  return [list(s.intersection(*ss))[0] for [s, *ss] in sets]

backpacks = [list(line.strip()) for line in open("input.txt")]

compartments = [[set(bp[0:len(bp) // 2]), set(bp[len(bp) // 2:])] for bp in backpacks]
print("Part 1:", sum(priority(x) for x in overlaps(compartments)))

groups = [map(set, backpacks[i * 3:i * 3 + 3]) for i in range(len(backpacks) // 3)]
print("Part 2:", sum(priority(x) for x in overlaps(groups)))