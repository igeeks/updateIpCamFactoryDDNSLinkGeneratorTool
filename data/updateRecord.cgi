#!/usr/bin/env python
# Import modules
import cgi, cgitb, json, sys

newUserId = ''
newPassword = ''

jsonDataFile = open('parsed.json')
jsonData = json.load(jsonDataFile)
jsonDataFile.close()


# create variables
postedData = json.load(sys.stdin)
emailAddress = postedData['emailAddress']

for item in jsonData:
    if(item['active']=='no'):
        newUserId = item['userid']
        newPassword = item['password']
        item['active'] = 'yes'
        item['email'] = emailAddress
        break


if (newUserId != ''):
    with open('parsed.json', 'w+') as jsonFile:
        jsonFile.write(json.dumps(jsonData))
    result = {'success':'true','message':'The Command Completed Successfully','UserID':newUserId,'password':newPassword};

else:
    result = {'success':'false','message':'The Command sucked'}


print('Content-Type: application/json\n\n')
print json.dumps(result)    # or "json.dump(result, sys.stdout)"

