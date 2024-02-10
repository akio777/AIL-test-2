
from test_case import test_cases


def solve(wordList, target):
    output = []
    length = len(wordList)
    for i in range(0, length):
        str_i = wordList[i]
        for j in range(i+1, length):
            str_j = wordList[j]
            # if str_i == str_j:
            #     continue
            if str_i+str_j == target or str_j+str_i == target:
                temp = (str_i, str_j)
                output.append(temp)

    for i in range(length-1, -1, -1):
        str_i = wordList[i]
        for j in range(i-1, -1, -1):
            str_j = wordList[j]
            # if str_i == str_j:
            #     continue
            if str_i+str_j == target or str_j+str_i == target:
                temp = (str_i, str_j)
                output.append(temp)
    output = list(set(output))
    print("output : ", output if len(output) > 0 else None)
    return output if len(output) > 0 else None

for i in test_cases:
    solve(i["wordList"], i["target"])
