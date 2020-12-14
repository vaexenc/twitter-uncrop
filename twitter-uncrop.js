// ==UserScript==
// @name        Twitter Image Uncropper
// @version     1.0.0
// @author      vaexenc
// @description 
// @homepage    https://github.com/vaexenc/twitter-uncrop
// @icon64      
// @include     https://twitter.com/*
// @include     https://mobile.twitter.com/*
// @grant       none
// ==/UserScript==

(function() {
	"use strict";

	function getMainImageContainerFromArticle(article) {
		const query = article.querySelector(".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg");
		if (query) return query.parentElement; // todo https://github.com/jshint/jshint/issues/3448
	}

	// function getRetweetContainerFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	setInterval(function() {
		const articles = document.querySelectorAll("article:not([data-uncropped])");

		for (let article of articles) {
			const imageContainer = getMainImageContainerFromArticle(article);
			if (!imageContainer) continue;

			const images = imageContainer.querySelectorAll("img");
			if (images.length == 0) continue; // if they haven't been added yet

			const aAndImageURLs = [];

			for (let image of images) {
				const a = image.closest("a");
				aAndImageURLs.push(
					{
						a: a,
						imageUrl: image.src.replace(/name=\w+/, "name=orig")
					}
				);
			}

			imageContainer.textContent = "";

			for (let aAndImageURL of aAndImageURLs) {
				let img = document.createElement("img");
				img.src = aAndImageURL.imageUrl;
				img.style = "width: 100%; margin-top: 5px; margin-bottom: 3px";
				aAndImageURL.a.classList = null;
				aAndImageURL.a.textContent = "";
				imageContainer.appendChild(aAndImageURL.a);
				aAndImageURL.a.appendChild(img);
			}

			article.setAttribute("data-uncropped", "");
		}
	}, 600);
})();
