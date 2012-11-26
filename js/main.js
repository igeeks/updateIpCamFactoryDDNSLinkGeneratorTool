console.log('JavaScript Working');


var displayURL = function (response, ipAddress, portNumber, cameraType) {
    console.log('made it to displayURL successfully');
    console.log(response);
    var userid = response.UserID,
        password = response.password;
    // on submit go to one of these links, replace variables with customer inputed stuff and usr/pass from datafile
    if (cameraType == 'H264') {
        // H264
        // http://{$ip}:{$port}/cgi-bin/set_ddns.cgi?ddns_enable=1&ddns_type=0&ddns_user={$userid}&ddns_pwd={$password}&ddns_address={$userid}.airsight.net
        var resetDdnsUrl = 'http://'+ipAddress+':'+portNumber+'/cgi-bin/set_ddns.cgi?ddns_enable=1&ddns_type=0&ddns_user='+userid+'&ddns_pwd='+password+'&ddns_address='+userid+'.example.com';
    } else if (cameraType == 'MJPEG') {
        // MJPEG
        // http://{$ip}:{$port}/set_factory_ddns.cgi?service=12&proxy_svr=airsight.net&proxy_port=80&host=/vipddns/upgengxin.asp&user={$userid}&pwd={$password}
        var resetDdnsUrl = 'http://'+ipAddress+':'+portNumber+'/set_factory_ddns.cgi?service=12&proxy_svr=example.com&proxy_port=80&host=/vipddns/upgengxin.asp&user='+userid+'&pwd='+password+'';
    } else {
        alert('cameraType does not match a current cameraType')
    };

    $('#SearchResults').empty();
    $('<p class="topSpacing boldText">Copy and Paste the following URL: </p><p>'+resetDdnsUrl+'</p>').appendTo($('#SearchResults'));
    $('#SearchResults').fadeIn('fast');

    return false;


};


$('#activateNewRecordsButton').on('click', function() {
    console.log('activate new records button worked');
    $('#activateNewRecordDialog').dialog({
        resizable: false,
        width: 500,
        height: 400,
        modal: true,
        buttons: {
            "Activate Record": function() {
                $('#activateNewRecordForm').submit();
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        }
    });
});


$('#activateNewRecordForm').validate({
    errorContainer: '#validationSummary',
    errorLabelContainer: '#validationSummary ul',
    errorElement: "li",
    showErrors: function (errorMap, errorList) {
        $('#errorMessageList').empty();
        if ( 'ip1' in errorMap || 'ip2' in errorMap || 'ip3' in errorMap || 'ip4' in errorMap ) {
            $('<li class="red">' + 'Please make sure to have a complete IP Address' + '</li>').appendTo($('#errorMessageList'));
        };
        if ( 'portNumber' in errorMap ) {
            $('<li class="red">' + 'Please make sure to include a port number' + '</li>').appendTo($('#errorMessageList'));
        };
        if ( 'emailAddress' in errorMap ) {
            $('<li class="red">' + 'Please include the customers email address' + '</li>').appendTo($('#errorMessageList'));
        };
        $('#validationSummary').fadeIn('fast');
    },
    submitHandler: function(form) {
        var data = $("#activateNewRecordForm").serializeArray();
        $( '#activateNewRecordDialog' ).dialog( "close" );
        submitActivationRecord(data);
    }
});

var recordRecord = function (ipAddress, portNumber, emailAddress, cameraType) {
    console.log('recordRecord starting')
    $.ajax({
        url: 'data/updateRecord.cgi',
        type: 'post',
        data: JSON.stringify({'emailAddress': emailAddress, 'ipAddress': ipAddress, 'portNumber': portNumber}),
        dataType: "json",
        success: function(response) {
            console.log('recordRecord ajax successful, sending info to displayURL')
            displayURL(response, ipAddress, portNumber, cameraType);
            alert('Success!')
        }
    });
};

var submitActivationRecord = function (data) {
    var values = {};
    $.each(data, function(i, field) {
        values[field.name] = field.value;
    });

    var ipAddress = "" + values.ip1 + "." + values.ip2 + "." + values.ip3 + "." + values.ip4,
        portNumber = values.portNumber,
        cameraType = values.camType,
        emailAddress = values.emailAddress.toLowerCase();

    console.log("IP Adress: " + ipAddress);
    console.log("Port Number: " + portNumber);
    console.log("Camera Type: " + cameraType);
    console.log("Email Address: " + emailAddress);

    recordRecord(ipAddress, portNumber, emailAddress, cameraType);
};


$('#searchRecordsButton').on('click', function() {
    console.log('search records button worked');
    $('#searchRecordsDialog').dialog({
        resizable: false,
        modal: true,
        buttons: {
            Cancel: function() {
                    $( this ).dialog( "close" );
            }
        }
    });
});


$('#searchRecordsForm').validate({
    submitHandler: function(form) {
        var searchTermQuery = $("#searchRecordsForm").serializeArray(),
            searchTerm = searchTermQuery[0].value;

        console.log(searchTermQuery);
        console.log(searchTerm);
        $( '#searchRecordsDialog' ).dialog( "close" );
        $.ajax({
            url: 'data/parsed.json',
            dataType: 'json',
            cache: false,
            success: function(data) {
                searchTerm = searchTerm.toLowerCase();
                if ( searchTerm == '*' ) {
                    console.log(data);
                    $('#SearchResults').empty();
                    $('<table id="SearchResultsTable"><tr><td><strong>UserID</strong></td>' +
                        '<td><strong>Password</strong></td>' +
                        '<td><strong>Active</strong></td>' +
                        '<td><strong>Email Address</strong></td></tr>' +
                        '</table>').appendTo($('#SearchResults'));
                    $.each(data, function(i){
                        console.log(data[i])
                        $('<tr><td>' + data[i].userid + '</td>' +
                        '<td>' + data[i].password + '</td>' +
                        '<td>' + data[i].active + '</td>' +
                        '<td>' + data[i].email + '</td>' +
                        '</tr>').appendTo($('#SearchResultsTable'));
                    });
                } else {
                    $('#SearchResults').empty();
                    $('<table id="SearchResultsTable"><tr><td><strong>UserID</strong></td>' +
                        '<td><strong>Password</strong></td>' +
                        '<td><strong>Active</strong></td>' +
                        '<td><strong>Email Address</strong></td></tr>' +
                        '</table>').appendTo($('#SearchResults'));
                    $.each(data, function(i){
                        if ((data[i].userid == searchTerm) || (data[i].email) == searchTerm){
                            $('<tr><td>' + data[i].userid + '</td>' +
                                '<td>' + data[i].password + '</td>' +
                                '<td>' + data[i].active + '</td>' +
                                '<td>' + data[i].email + '</td>' +
                                '</tr>').appendTo($('#SearchResultsTable'));
                        }
                    });
                }
                $('#SearchResults').fadeIn('fast');
            },
            error: console.log('error opening ajax json')
        });
    }
});


$(document).ready(function() {
    // temporary do not submit any forms
    $("form").submit(function () { return false; }); // so it won't submit

});


