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

	const RETWEETS_ENABLED = true;

	const IMAGE_URL_NAME = "orig";
	const MAIN_IMAGE_CONTAINER_SOURCE_SELECTOR = ".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg";
	const RETWEET_DIRECT_IMAGE_CONTAINER_SOURCE_SELECTOR = "div[class='css-1dbjc4n r-1g94qm0']";
	const RETWEET_TIMELINE_IMAGE_CONTAINER_SOURCE_SELECTOR = ".css-1dbjc4n.r-k200y.r-42olwf.r-1867qdf.r-1phboty.r-dta0w2.r-1n0xq6e.r-1g94qm0.r-zg41ew.r-1udh08x";
	const RETWEET_IMAGE_CONTAINER_TARGET_SELECTOR = ".css-1dbjc4n.r-18bvks7.r-1867qdf.r-rs99b7.r-1loqt21.r-dap0kf.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg";
	const IMAGE_STYLE = "width: 100%; margin-top: 5px; margin-bottom: 3px";
	const IMAGE_CONTAINER_SOURCE_STYLE = "opacity: 0; height: 0px; border-width: 0px; margin: 0px 0px 0px 0px;";
	const IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE = "data-uncropper-marked";

	function getMainImageContainerTargetFromMainImageContainerSource(imageContainer) {
		return imageContainer.parentElement;
	}

	function getRetweetImageContainerTargetFromRetweetImageContainerSource(imageContainer) {
		return imageContainer.closest(RETWEET_IMAGE_CONTAINER_TARGET_SELECTOR);
	}

	function sanitizeImageA(a) {
		a.classList = null;
		a.textContent = "";
	}

	function getHighQualityImageURLfromImage(image) {
		return image.src.replace(/name=\w+/, "name=" + IMAGE_URL_NAME);
	}

	function createImage(imageUrl, style) {
		const image = document.createElement("img");
		image.src = imageUrl;
		image.style = style;
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

	function uncropMainImages(imageNode) {
		const mainImageContainerSource = imageNode.closest(MAIN_IMAGE_CONTAINER_SOURCE_SELECTOR);
		if (!mainImageContainerSource || mainImageContainerSource.hasAttribute(IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE)) return;
		mainImageContainerSource.setAttribute(IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE, "");
		setTimeout(function() {
			const mainImageContainerTarget = getMainImageContainerTargetFromMainImageContainerSource(mainImageContainerSource);
			const images = Array.from(mainImageContainerSource.querySelectorAll("img"));
			images.sort(imageArraySortFunction);
			for (const image of images) {
				const newImage = createImage(getHighQualityImageURLfromImage(image), IMAGE_STYLE);
				const imageA = image.closest("a");
				sanitizeImageA(imageA);
				mainImageContainerTarget.append(imageA);
				imageA.append(newImage);
			}
			mainImageContainerSource.remove();
		}, 0);
	}

	function uncropRetweetImages(imageNode) {
		const retweetImageContainerSource = imageNode.closest(RETWEET_DIRECT_IMAGE_CONTAINER_SOURCE_SELECTOR) || imageNode.closest(RETWEET_TIMELINE_IMAGE_CONTAINER_SOURCE_SELECTOR);
		if (!retweetImageContainerSource || retweetImageContainerSource.hasAttribute(IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE)) return;
		retweetImageContainerSource.setAttribute(IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE, "");
		setTimeout(function() {
			const retweetImageContainerTarget = getRetweetImageContainerTargetFromRetweetImageContainerSource(retweetImageContainerSource);
			const images = Array.from(retweetImageContainerSource.querySelectorAll("img"));
			images.sort(imageArraySortFunction);
			for (const image of images) {
				const newImage = createImage(getHighQualityImageURLfromImage(image), IMAGE_STYLE);
				const imageA = image.closest("a");
				sanitizeImageA(imageA);
				retweetImageContainerTarget.append(imageA);
				imageA.append(newImage);
			}
			retweetImageContainerSource.remove();
		}, 0);
	}

	const observerTarget = document.querySelector("html");
	const observerConfig = {childList: true, subtree: true};

	const observerCallback = function(mutationsList) {
		for (const mutation of mutationsList) {
			if (!mutation.addedNodes) return;
			for (const addedNode of mutation.addedNodes) {
				if (
					addedNode.tagName === "DIV"
					&& (
						addedNode.matches(MAIN_IMAGE_CONTAINER_SOURCE_SELECTOR)
						|| addedNode.matches(RETWEET_DIRECT_IMAGE_CONTAINER_SOURCE_SELECTOR)
						|| addedNode.matches(RETWEET_TIMELINE_IMAGE_CONTAINER_SOURCE_SELECTOR)
					)
					&& addedNode.closest("article")
				) {
					addedNode.style.cssText += IMAGE_CONTAINER_SOURCE_STYLE;
				}
				else if (addedNode.tagName === "IMG" && addedNode.src.includes("&name=")) {
					uncropMainImages(addedNode);
					if (RETWEETS_ENABLED) uncropRetweetImages(addedNode);
				}
			}
		}
	};

	const observer = new MutationObserver(observerCallback);
	observer.observe(observerTarget, observerConfig);
})();
