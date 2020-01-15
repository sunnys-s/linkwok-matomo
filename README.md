# Analytics for Linkwok
Followings are the steps needed to complete click stream or event tracking analytics on Linkwok. we are using Matomo(Previously known as Matomo for analytics tracking). Matomo is a open source analytics application, which works similarly as Google Analytics.

We can either use script tag like google analytics in header and we are done. But in this application(Linkwok), we are going to use 'matomo-tracker' npm pacakage. There is no package in meteor which currenly supports matomo, hence I have added some code that needs to be copied. 

Pre-requisite: docker and docker-compose

## Step 0. Clone this Repository.

```git clone https://github.com/sunnys-s/linkwok-matomo```

## Step 1. Install docker in your machine(server)

Please click [here](https://docs.docker.com/compose/install/) to follow the guidelines to install docker

## Step 2. Install docker-compose

- Please click [here](https://docs.docker.com/compose/install/) to follow the guidelines to install docker.

## Step 3. Install Matomo
- To install matomo and run matomo all you need to do is: 
```docker-compose up --build``` or ```docker-compose up --build -d``` (to run in background), after this you can visit https://<<ip_addr>>:4443, and see that matomo is running. By default matomo runs force SSL. Credentials are: 
    - Username: User
    - Password: bitnami
- We need to force matamo not use SSL. To do this do following:
    - Open a different terminal window.
    - We need to login in matomo container:
        1. Run ```docker ps```, you will get output like this. Copy Container ID of matomo from the results and enter following commands:
            - ```docker exec -it 1e34bdbccae3 /bin/bash ```.  
            - Now you are inside the container. You need to go to following file and make comment this line or remove this line, before that install nano editor. Do this:
                - ```apt-get update```
                - ```apt-get install nano```
            - Now edit ```nano /opt/bitnami/matomo/config/config.ini.php``` and remove or comment `forceSSL = 1` line.
- Go back to terminal window where you are running ```docker-compose up --build``` press ctrl+c to stop it and restart it using the same command.

- Now, if you visit http://<<ip_adrress>>:8080, not matomo is running on it as well. Credentials are same.
    - Username: User
    - Password: bitnami
- Create a website entry in your matomo app and copy the id for later use.

## Step 4. Install matomo-tracker on linkwok app.

```npm install --save matomo-tracker```

## Step 5: Copy the methods:
- From this repository copy the server/matomo.js and paste it in server directory of your meteor app(Linkwok).
- Like previous step copy the client/matomo.js from this repository and paste it in client/js directory of your meteor app(Linkwok).
- In settings.json create an object for this as well use following code.
    ```javascript 
	"matomo": {
		"url": "http://your_matomo_server_url/matomo.php",
		"site_id": 'Your site id'
	}
    ```
- You are good to go.

## Test
In your browser console enter these and see if entries are getting stored in matomo.

```javascript 
Meteor.Matomo.trackEvent("/member/HvyY44u8rSA6WLxG5/my_activities", {category: "Reports", action: "Viewed", name: "Click", value: 45})
```

```javascript 
Meteor.call("trackPage", "/member/HvyY44u8rSA6WLxG5/my_activities", {})
```
## Usage

On the client serveral helpers functions are provided to track different statistics.

Before any tracking you should call the helper `setUserInfo` with the current UserId or with null.
This helper collects data like the user Agent the referral and the resolution of the users device.

```
Meteor.startup(function() {
    return Tracker.autorun(function() {
        var userId;
        userId = Meteor.userId();
        Meteor.Matomo.setUserInfo(userId);
    });
});
```

To track a specific site use the following method:
```
// to track page in your router (onRun hook)
Meteor.Matomo.trackPage(Router.current().route.path(this));
```

To track a download use:
```
Meteor.Matomo.trackDownload(downloadUrl);
```

To track a external Link use:
```
Meteor.Matomo.trackLink(linkUrl);
```

To track a search use:
```
Meteor.Matomo.trackSearch(url, {
    search: 'my cool keyword', // the search term
    search_cat: 'page search', //the category of the search
    search_count: '42' //the number of search results

});
```

To track a goal use:
```
Meteor.Matomo.trackGoal(url, goalId)
```



```
// track an event
Meteor.Matomo.trackEvent(
	Router.current().route.path(this), // the route: ie - /home, not the full url
	{
		category: "Page or Section",
		action: "Viewed|Completed|Submitted|Etc",
		name: "Name of the Event - Submitted Contact Form",
		value: "Optional Value - like how many rows saved, etc."
	},
	{// any number of extra optional values.
	 // Pass null if you do not want to pass additional values
		"1": ["Name", "Value", "page|visit"],
		"2": ["Name", "Value", "page|visit"],
		"3": ["Name", "Value", "page|visit"],
		"4": ["Name", "Value", "page|visit"],
		"5": ["Name", "Value", "page|visit"],
		"6": ["Name", "Value", "page|visit"]
	}
);
```
