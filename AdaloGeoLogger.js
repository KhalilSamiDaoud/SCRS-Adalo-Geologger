import React, { Component } from 'react'
import { View } from 'react-native'

class GeoLocator extends Component {
	userLat;
	userLong;

	constructor(props) {
		super(props);
	}

	userAction = async (location) => {
		const { Identifier } = this.props;

		const SCRSRequest = await fetch('https://api.adalo.com/v0/apps/920b680b-4313-4f4f-bd34-5ef6e5598812/collections/t_d6d87c4ed4cc47c09c0af74213493cfc', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ###',
				'Host': 'api.adalo.com'
			}
		});
		const SRCSResponse = await SCRSRequest.json();

		var records = Object.values(JSON.parse(JSON.stringify(SRCSResponse)));
		var userRecord = records[0].filter(element => element.Email == Identifier);

		if (userRecord.length) {
			const ITCRequest = await fetch('http://192.168.6.7:9029/SaveCustomerLocation', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Basic ' + btoa('itc_scrs:###'),
				},
				body: JSON.stringify({
					'appid': "scrs_web",
					'userid': "0",
					'email': Identifier,
					'Latitude': this.userLat,
					'Longitude': this.userLong
				})
			});
			const ITCResponse = await ITCRequest.json();
		}
	}

	componentDidMount() {
		let currComp = this;

		if ("geolocation" in navigator) {
			console.log("Geoloction Available");
		} else {
			console.log("Geoloction not Available - Disabled by userAgent");
		}

		navigator.geolocation.getCurrentPosition(function (position) {
			currComp.userLat = position.coords.latitude;
			currComp.userLong = position.coords.longitude;

		}, function (error) { console.log(error.message) });
	}

	render() {
		this.userAction();

		return (<View></View>);
	}
}

export default GeoLocator