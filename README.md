updateIpCamFactoryDDNSLinkGeneratorTool
=======================================

This tool generates a URL to update IPCameras to have a new Factory DDNS and updates a JSON file



data/updateRecord.cgi
=====================
This file is called by pressing the Activate Record button on the Activate New Record Dialog. The CGI file is given information via post from the js file and is called by using sys.stdin and converting the data to json. This file will take the information and check for the next available ddns record and update the record to reflect it being used and by whome.


js/main.js
==========
The displayURL() function is the real heart and reason for this program. After all the other funcitons have done their jobs, displayURL() gets supplied the information to give back to the user. The URL's that it is giving the user is assuming that it is a specific (and unsupplied publicly) camera, and needs to be updated to example.com DDNS server. After the URL is supplied, you should be able to send it to the customer and have them copy and paste it into their web browser and it should automatically update their camera.

Note: If the supplied IP address is an external IP, then the user can update the camera for the customer. However, if it is an internal IP then the customer must do this from home or let the user login to their machine using a tool such as LogMeIn.com, TeamViewer, or GoToMyPC.




Requested Possible Updates
=================
- More Comments to help explain code
- use a tiny url generator
- possibly mail the url to the email address to be provided if option is checked



ChangeLog
=========
2012-11-26: Created