// ==UserScript==
// @name        Twitter Image Uncropper
// @version     0.1.0
// @description Uncrops images in tweets.
// @include     https://twitter.com/*
// @include     https://mobile.twitter.com/*
// @icon
// @author      vaexenc
// @namespace   https://github.com/vaexenc
// @grant       none
// ==/UserScript==

(function() {
	"use strict";

	// const OPTION_RETWEETS = true;

	const APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR = ".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg";
	// const RETWEET_SELECTOR = "div[class='css-1dbjc4n r-156q2ks']";
	// const RETWEET_CONTENT_SELECTOR = "div[class='css-1dbjc4n r-18u37iz']"
	const IMAGE_STYLE = "width: 100%; margin-top: 5px; margin-bottom: 3px";
	const APPROXIMATE_MAIN_IMAGE_CONTAINER_STYLE = "opacity: 0; height: 0px; border-width: 0px; margin-top: 0px;";
	const APPROXIMATE_MAIN_IMAGE_CONTAINER_CUSTOM_ATTRIBUTE = "data-uncropper-marked";

	function getMainImageContainerFromApproximateMainImageContainer(imageContainer) {
		return imageContainer.parentElement;
	}

	function sanitizeImageA(a) {
		a.classList = null;
		a.textContent = "";
	}

	function getHighQualityImageURLfromImage(image) {
		return image.src.replace(/name=\w+/, "name=orig");
	}

	function createImage(imageUrl) {
		const image = document.createElement("img");
		image.src = imageUrl;
		image.style = IMAGE_STYLE;
		return image;
	}

	function getOrderNumberFromImage(image) {
		return parseInt(image.closest("a").href.match(/\d$/)[0]);
	}

	// function getRetweetContainerFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	function imageArraySortFunction(image1, image2) {
		const image1OrderNumber = getOrderNumberFromImage(image1);
		const image2OrderNumber = getOrderNumberFromImage(image2);
		if (image1OrderNumber < image2OrderNumber) return -1;
		return 1;
	}

	function doTheImageThing(imageNode) {
		const approximateMainImageContainer = imageNode.closest(APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR);
		if (!approximateMainImageContainer || approximateMainImageContainer.hasAttribute(APPROXIMATE_MAIN_IMAGE_CONTAINER_CUSTOM_ATTRIBUTE)) return;
		approximateMainImageContainer.style.cssText += APPROXIMATE_MAIN_IMAGE_CONTAINER_STYLE;
		approximateMainImageContainer.setAttribute(APPROXIMATE_MAIN_IMAGE_CONTAINER_CUSTOM_ATTRIBUTE, "");
		setTimeout(function() {
			const mainImageContainer = getMainImageContainerFromApproximateMainImageContainer(approximateMainImageContainer);
			const images = Array.from(approximateMainImageContainer.querySelectorAll("img"));
			images.sort(imageArraySortFunction);
			for (const image of images) {
				const newImage = createImage(getHighQualityImageURLfromImage(image));
				const imageA = image.closest("a");
				sanitizeImageA(imageA);
				mainImageContainer.append(imageA);
				imageA.append(newImage);
			}
			approximateMainImageContainer.remove();
		}, 0);
	}

	const observerTarget = document.querySelector("html");
	const observerConfig = {childList: true, subtree: true};

	const observerCallback = function(mutationsList) {
		for (const mutation of mutationsList) {
			if (!mutation.addedNodes) return;
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.tagName !== "IMG" || !addedNode.src.includes("&name=")) continue;
				doTheImageThing(addedNode);
			}
		}
	};

	const observer = new MutationObserver(observerCallback);
	observer.observe(observerTarget, observerConfig);
})();
