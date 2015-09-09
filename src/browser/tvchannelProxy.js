'use strict';

var windowType = ['MAIN'];

var channelChangeCallback = [];

var infoListIndex = 0;
var channelInfoList = [
	{MAJOR: 6, MINOR: 1, CHANNELNAME: 'SBS', PROGRAMNUMBER: 1, PTC: 16, LCN: 0, SOURCEID: 1, TRNSPORTSTREAMID: 5137, ORIGINALNETWORKID: 0, SERVICENAME:'SBS'},
	{MAJOR: 7, MINOR: 1, CHANNELNAME: 'KBS2', PROGRAMNUMBER: 2, PTC: 17, LCN: 0, SOURCEID: 2, TRNSPORTSTREAMID: 2065, ORIGINALNETWORKID: 0, SERVICENAME:'KBS2'},
	{MAJOR: 8, MINOR: 1, CHANNELNAME: 'OBS', PROGRAMNUMBER: 1, PTC: 25, LCN: 0, SOURCEID: 1, TRNSPORTSTREAMID: 4357, ORIGINALNETWORKID: 0, SERVICENAME:'OBS'},
	{MAJOR: 9, MINOR: 1, CHANNELNAME: 'KBS1', PROGRAMNUMBER: 2, PTC: 15, LCN: 0, SOURCEID: 2, TRNSPORTSTREAMID: 1041, ORIGINALNETWORKID: 0, SERVICENAME:'KBS1'},
	{MAJOR: 10, MINOR: 1, CHANNELNAME: 'EBS1', PROGRAMNUMBER: 1, PTC: 18, LCN: 0, SOURCEID: 1, TRNSPORTSTREAMID: 4113, ORIGINALNETWORKID: 0, SERVICENAME:'EBS1'},
	{MAJOR: 10, MINOR: 2, CHANNELNAME: 'EBS2', PROGRAMNUMBER: 2, PTC: 18, LCN: 0, SOURCEID: 2, TRNSPORTSTREAMID: 4113, ORIGINALNETWORKID: 0, SERVICENAME:'EBS2'},
	{MAJOR: 11, MINOR: 1, CHANNELNAME: 'MBC', PROGRAMNUMBER: 1, PTC: 14, LCN: 0, SOURCEID: 1, TRNSPORTSTREAMID: 3089, ORIGINALNETWORKID: 0, SERVICENAME:'MBC'}
];
var date = new Date();
var programInfoList = [
	{TITLE: 'Program Title 1', STARTTIME: date, DURATION: 3766, DETAILEDDESCRIPTION: 'Episode 2', LANGUAGE: 'KOREAN', RATING: ''},
	{TITLE: 'Program Title 2', STARTTIME: date, DURATION: 3760, DETAILEDDESCRIPTION: 'Episode 1', LANGUAGE: 'KOREAN', RATING: ''},
	{TITLE: 'Program Title 3', STARTTIME: date, DURATION: 3800, DETAILEDDESCRIPTION: 'Episode 4', LANGUAGE: 'KOREAN', RATING: ''},
	{TITLE: 'Program Title 4', STARTTIME: date, DURATION: 3680, DETAILEDDESCRIPTION: 'Episode 8', LANGUAGE: 'KOREAN', RATING: ''},
	{TITLE: 'Program Title 5', STARTTIME: date, DURATION: 980, DETAILEDDESCRIPTION: 'Episode 9', LANGUAGE: 'KOREAN', RATING: ''},
	{TITLE: 'Program Title 6', STARTTIME: date, DURATION: 2910, DETAILEDDESCRIPTION: 'Episode 3', LANGUAGE: 'KOREAN', RATING: ''},
	{TITLE: 'Program Title 7', STARTTIME: date, DURATION: 3700, DETAILEDDESCRIPTION: 'Episode 5', LANGUAGE: 'KOREAN', RATING: ''}
];

function getTvwindowElement () {
	var element = '';
	
	if (!document.getElementById('tvwindowshow')) {
		element = document.createElement('div');
		element.id = 'tvwindowshow';
	} else {
		element = document.getElementById('tvwindowshow');
	}

	return element;
}

function randomColor () {
	var color = '#';

	for (var i = 0; i < 6; i++) {
		if(Math.floor(Math.random() * 2) === 0){
		color = color + '0';
		} else {
			color = color + 'f';
		}	
	}

	return color;
}

function fireChannelChangeEvent (channelInfo, args) {
	for (var i = 0; i < channelChangeCallback.length; i++) {
		channelChangeCallback[i](channelInfo, args);
	}
}

module.exports = {
	tune: function (success, fail, args) {
		var match = false;
		var element = getTvwindowElement();

		for (var i = 0; i < channelInfoList.length; i++) {
			if (args[0].MAJOR == channelInfoList[i].MAJOR && args[0].MINOR == channelInfoList[i].MINOR) {
				infoListIndex = i;

				element.style.backgroundColor = randomColor();
				element.innerHTML = 'Channel : ' + channelInfoList[infoListIndex].MAJOR + '-' + channelInfoList[infoListIndex].MINOR;

				match = true;
			}
		}

		if (match) {
			setTimeout(function () {
				success.onsuccess(channelInfoList[infoListIndex], windowType[0]);
				fireChannelChangeEvent(channelInfoList[infoListIndex], windowType[0]);
			}, 0);
		} else {
			setTimeout(function () {
				fail({
					code: 8,
					name: 'NOT_FOUND_ERR',
					message: 'Failed to find the channel'
				});
			}, 0);
		}
	},
	tuneUp: function (success, fail, args) {
		var element = getTvwindowElement();

		if (infoListIndex < channelInfoList.length - 1) {
			infoListIndex = infoListIndex + 1;
		} else {
			infoListIndex = 0;
		}

		element.style.backgroundColor = randomColor();
		element.innerHTML = 'Channel : ' + channelInfoList[infoListIndex].MAJOR + '-' + channelInfoList[infoListIndex].MINOR;

		setTimeout(function () {
			success.onsuccess(channelInfoList[infoListIndex], windowType[0]);
			fireChannelChangeEvent(channelInfoList[infoListIndex], windowType[0]);
		}, 0);
	},
	tuneDown: function (success, fail, args) {
		var element = getTvwindowElement();

		if (0 < infoListIndex) {
			infoListIndex = infoListIndex - 1;
		} else {
			infoListIndex = 6;
		}

		element.style.backgroundColor = randomColor();
		element.innerHTML = 'Channel : ' + channelInfoList[infoListIndex].MAJOR + '-' + channelInfoList[infoListIndex].MINOR;

		setTimeout(function () {
			success.onsuccess(channelInfoList[infoListIndex], windowType[0]);
			fireChannelChangeEvent(channelInfoList[infoListIndex], windowType[0]);
		}, 0);
	},
	findChannel: function (success, fail, args) {
		var channelInfoIndex = 0;
		var channelInfo = [];

		for (var i = 0; i < channelInfoList.length; i++) {
			if (args[0] == channelInfoList[i].MAJOR && args[1] == channelInfoList[i].MINOR) {
				channelInfo[channelInfoIndex] = channelInfoList[i];
				channelInfoIndex = channelInfoIndex + 1;
			}
		}

		if (!channelInfo) {
			setTimeout(function () {
				fail({
					code: 8,
					name: 'NOT_FOUND_ERR',
					message: 'Failed to find the channel'
				});
			}, 0);
		} else {
			setTimeout(function () {
				success(channelInfo);
			}, 0);
		}
	},
	getChannelList: function (success, fail, args) {
		setTimeout(function () {
			success(channelInfoList);
		}, 0);
	},
	getCurrentChannel: function (success, fail, args) {
		setTimeout(function () {
			success(channelInfoList[infoListIndex]);
		}, 0);
	},
	getProgramList: function (success, fail, args) {
		setTimeout(function () {
			success(programInfoList);
		}, 0);
	},
	getCurrentProgram: function (success, fail, args) {
		setTimeout(function () {
			success(programInfoList[infoListIndex]);
		}, 0);
	},
	addChannelChangeListener: function (success, fail, args) {
		channelChangeCallback.push(success);
	},
	removeChannelChangeListener: function (success, fail, args) {
		fail = null;
		args = null;

		for (var i = 0; i < channelChangeCallback.length; i++) {
			if (channelChangeCallback[i] === success) {
				channelChangeCallback.splice(i, 1);
			}
		}
	}
};

require('cordova/exec/proxy').add('toast.tvchannel', module.exports);