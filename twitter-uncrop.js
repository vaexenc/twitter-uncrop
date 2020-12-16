// ==UserScript==
// @name        Twitter Image Uncropper
// @version     0.1.0
// @author      vaexenc
// @description Uncrops images in tweets.
// @homepage    https://github.com/vaexenc
// @source      https://github.com/vaexenc/twitter-uncrop
// @icon64
// @include     https://twitter.com/*
// @include     https://mobile.twitter.com/*
// @grant       none
// ==/UserScript==

(function() {
	"use strict";

	const APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR = ".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg";
	const IMAGE_STYLE = "width: 100%; margin-top: 5px; margin-bottom: 3px";
	const UNCROPPED_ATTRIBUTE_NAME = "data-uncropper-uncropped";

	function getMainImageContainerFromApproximateElement(approximateElement) {
		return approximateElement.parentEntity;
	}

	function getMainImageContainerFromArticle(article) {
		const approximateElement = article.querySelector(APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR);
		if (!approximateElement) {return;}
		return getMainImageContainerFromApproximateElement(approximateElement);
	}

	function getMainImageContainerFromImage(image) {
		const approximateElement = image.closest(APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR);
		if (!approximateElement) {return;}
		return getMainImageContainerFromApproximateElement(approximateElement);
	}

	function getAAndImageURLFromImage(image) {
		const a = image.closest("a");
		const imageURL = image.src.replace(/name=\w+/, "name=orig");
		return {a: a, imageURL: imageURL};
	}

	function clearImageContainerContent(imageContainer) {
		imageContainer.textContent = "";
	}

	function createImage(imageUrl) {
		let image = document.createElement("img");
		image.src = imageUrl;
		image.style = IMAGE_STYLE;
		return image;
	}

	function sanitizeA(a) {
		a.classList = null;
		a.textContent = "";
	}

	// function getRetweetContainerFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	// const target = document.querySelector("html");
	// // const target = document.querySelector("html");
	// const config = {childList: true, subtree: true};
	// const callback = function(mutationsList, observer) {
	// 	for (const mutation of mutationsList) {
	// 		if (!mutation.addedNodes) {return;}
	// 		for (const addedNode of mutation.addedNodes) {
	// 			if (addedNode.tagName != "IMG" || !addedNode.src.includes("&name=")) {continue;}
	// 			addedNode.closest("article").style.setProperty("opacity", 0.1);
	// 			console.log("            ", addedNode);
	// 		}
	// 	}
	// };
	// const observer = new MutationObserver(callback);
	// observer.observe(target, config);
	// return;
})();
