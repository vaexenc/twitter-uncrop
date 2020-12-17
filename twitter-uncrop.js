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
	const ATTRIBUTE_NAME_MAIN_IMAGE_CONTAINER = "data-uncropper-main-image-container";

	function getMainImageContainerFromArticle(article) {
		return article.querySelector(APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR)?.parentElement;
	}

	function getMainImageContainerFromImage(image) {
		return image.closest(APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR).parentElement;
	}

	function sanitizeImageA(a) {
		a.classList = null;
		a.textContent = "";
	}

	function getHighQualityImageURLfromImage(image) {
		return image.src.replace(/name=\w+/, "name=orig");
	}

	function clearImageContainerContent(imageContainer) {
		imageContainer.textContent = "";
	}

	function createImage(imageUrl) {
		const image = document.createElement("img");
		image.src = imageUrl;
		image.style = IMAGE_STYLE;
		return image;
	}

	// function getRetweetContainerFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	const observerTarget = document.querySelector("html");
	const observerConfig = {childList: true, subtree: true};

	const observerCallback = function(mutationsList) {
		for (const mutation of mutationsList) {
			if (!mutation.addedNodes) {return;}
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.tagName !== "IMG" || !addedNode.src.includes("&name=")) {continue;}
				const image = addedNode;
				const newImage = createImage(getHighQualityImageURLfromImage(image));
				const imageA = image.closest("a");
				const mainImageContainer = getMainImageContainerFromImage(image);
				sanitizeImageA(imageA);
				mainImageContainer.append(imageA);
				imageA.append(newImage);
			}
		}
	};

	const observer = new MutationObserver(observerCallback);
	observer.observe(observerTarget, observerConfig);
})();
