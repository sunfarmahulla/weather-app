

mobiscroll.settings = {
    theme: 'ios',
    themeVariant: 'light'
};

// Load the Google API Client
window.onGoogleLoad = function () {
    window.gapi.load('client', initClient);
}

// Load the SDK asynchronously
function loadGoogleSDK() {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            onGoogleLoad();
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://apis.google.com/js/api.js?onload=onGoogleLoad";
        js.onload = "onGoogleLoad";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
};

// Init the Google API client
function initClient() {
    window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        calApiLoaded = true;
        loadEvents(firstDay, lastDay);
    });
}

// Load events from Google Calendar between 2 dates
function loadEvents(firstDay, lastDay) {
    // Only load events if the Google API finished loading
    if (calApiLoaded) {
        window.gapi.client.calendar.events.list({
            'calendarId': CALENDAR_ID,
            'timeMin': firstDay.toISOString(),
            'timeMax': lastDay.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(function (response) {
            var event;
            var events = response.result.items;
            var eventList = [];
            // Process event list
            for (var i = 0; i < events.length; ++i) {
                event = events[i];
                eventList.push({
                    start: event.start.date || event.start.dateTime,
                    end: ((new Date(event.end.date) - new Date(event.start.date)) / 86400000 == 1 ? '' : event.end.date) || event.end.dateTime,
                    text: event.summary || 'No Title',
                });
            }
            // Pass the processed events to the calendar
            calInst.setEvents(eventList);
        });
    }
}

var API_KEY = 'AIzaSyAPBxJ6Oxuslb26B3R8-VfyMuWDE_EUuvw';
var CLIENT_ID = '925658568607-v2jsoko9j3vtctsp2u1cmr5dod0pq3ll.apps.googleusercontent.com';
var CALENDAR_ID = 'en.hungarian#holiday@group.v.calendar.google.com';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var calApiLoaded;
var firstDay;
var lastDay;

var calInst = mobiscroll.eventcalendar('#demo-google-cal', {
    display: 'inline',
    view: {
        calendar: {
            labels: true
        }
    },
    data: [],
    onPageLoading: function (event) {
        var year = event.firstDay.getFullYear(),
            month = event.firstDay.getMonth();

        // Calculate dates 
        // (pre-load events for previous and next months as well)
        firstDay = new Date(year, month - 1, -7);
        lastDay = new Date(year, month + 2, 14);

        loadEvents(firstDay, lastDay);
    }
});

// Load the Google SDK
loadGoogleSDK();

