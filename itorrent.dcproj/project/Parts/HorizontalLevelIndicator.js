/* 
 This file was generated by Dashcode and is covered by the 
 license.txt included in the project.  You may edit this file, 
 however it is recommended to first turn off the Dashcode 
 code generator otherwise the changes will be lost.
 */

// Note: Properties and methods beginning with underbar ("_") are considered private and subject to change in future Dashcode releases.

function CreateHorizontalLevelIndicator(elementOrID, spec)
{
    var levelIndicatorElement = elementOrID;
    if (elementOrID.nodeType != Node.ELEMENT_NODE) {
        levelIndicatorElement = document.getElementById(elementOrID);
    }
	if (!levelIndicatorElement.loaded) 
	{
		levelIndicatorElement.loaded = true;
		var onchanged = spec.onchange || null;
		try { onchanged = eval(onchanged); } catch (e) { onchanged = null; }
		levelIndicatorElement.object = new HorizontalLevelIndicator(levelIndicatorElement, spec.value || 0, spec.minValue || 0, spec.maxValue || 0, spec.onValue || 0, spec.warningValue || 0, spec.criticalValue || 0, spec.spacing || 0, spec.stacked || false, spec.interactive || false, spec.continuous || false, spec.imageOff || null, spec.imageOn || null, spec.imageWarning || null, spec.imageCritical || null, spec.imageWidth || 0, spec.imageHeight || 0, onchanged, spec.originalID);
		return levelIndicatorElement.object;
	}
}

/*******************************************************************************
* HorizontalLevelIndicator
* Implementation of LevelIndicator
*
*
*/

function HorizontalLevelIndicator(levelIndicator, value, minValue, maxValue, onValue, warningValue, criticalValue, spacing, stacked, interactive, continuous, imageOff, imageOn, imageWarning, imageCritical, imageWidth, imageHeight, onchanged, originalID)
{
	/* Objects */
    this.element = levelIndicator;
	this._levelIndicator = levelIndicator;
	
	/* public properties */
	// These are read-write. Set them as needed.
	this.onchanged = onchanged;
	this.continuous = continuous; // Fire onchanged live, as opposed to onmouseup
	
	// These are read-only. Use the setter functions to set them.
	this.value = value;
	
	/* Internal objects */
	this._track = null;
    this._originalID = originalID;
		
	this.imageWidth = imageWidth;
	this.imageHeight = imageHeight;
	this.imageOffPath = imageOff == null ? "Images/HorizontalOff.png" : imageOff;
	this.imageOnPath = imageOn == null ? "Images/HorizontalOn.png" : imageOn;
	this.imageWarningPath = imageWarning == null ? "Images/HorizontalWarning.png" : imageWarning;
	this.imageCriticalPath = imageCritical == null ? "Images/HorizontalCritical.png" : imageCritical;
		
	this._init(value, minValue, maxValue, onValue, warningValue, criticalValue, spacing, stacked, interactive, imageOn, imageOff, imageWarning, imageCritical, imageWidth, imageHeight);
}

// Inherit from LevelIndicator
HorizontalLevelIndicator.prototype = new LevelIndicator(null);

HorizontalLevelIndicator.prototype._getMousePosition = function(event)
{
	if (event !== undefined)
		return event.x;
	else
		return 0;
}

HorizontalLevelIndicator.prototype._computeValueFromMouseEvent = function(event)
{
	var style = this._computedLevelIndicatorStyle;
	var left = style ? parseInt(style.getPropertyValue("left"), 10) : 0;
	var width = style ? parseInt(style.getPropertyValue("width"), 10) : 0;
	var position = this._getMousePosition(event);
	var newValue = this.minValue + (((this.maxValue - this.minValue) * (position - left)) / width);
	
	if (newValue < this.minValue)
		newValue = this.minValue;
	else if (newValue > this.maxValue)
		newValue = this.maxValue;
		
	return newValue;
}

HorizontalLevelIndicator.prototype._computePositionFromValue = function(newValue)
{
	var style = this._computedLevelIndicatorStyle;
	var width = style ? parseInt(style.getPropertyValue("width"), 10) : 0;
	var position = (width * (newValue - this.minValue)) / (this.maxValue - this.minValue);
	
	return position;
}

HorizontalLevelIndicator.prototype._computeValueFromPosition = function(position)
{
	var style = this._computedLevelIndicatorStyle;
	var width = style ? parseInt(style.getPropertyValue("width"), 10) : 0;
	var newValue = this.minValue + (((this.maxValue - this.minValue) * position) / width);
		
	return newValue;
}

HorizontalLevelIndicator.prototype._computeLevelIndicatorLength = function()
{
	// get the current actual slider length
	var style = this._computedLevelIndicatorStyle;
	return style ? parseInt(style.getPropertyValue("width"), 10) : 0;
}

HorizontalLevelIndicator.prototype._layoutElements = function()
{
	var length = this._computeLevelIndicatorLength();
	var valuePosition = this._computePositionFromValue(this.value);
	var delta = 0;
	
	var imagePath = null;
	
	while (delta + this.imageWidth <= length)
	{
		var element = document.createElement("div");
		var style = element.style;
		style.position = "absolute";
		style.display = "block";
		style.top = "0px";
		style.left = delta + "px";
		style.width = this.imageWidth + "px";
		style.height = this.imageHeight + "px";
		
		var currentValue = this.value;
		if (this.stacked)
		{
			currentValue = this._computeValueFromPosition(delta + this.imageWidth);
		}
		if (delta >= valuePosition)
			imagePath = this.imageOffPath;
		else if (currentValue >= this.criticalValue)
			imagePath = this.imageCriticalPath;
		else if (currentValue >= this.warningValue)
			imagePath = this.imageWarningPath;
		else if (this.value >= this.onValue)
			imagePath = this.imageOnPath;
		else
			imagePath = this.imageOffPath;
        
		style.background = "url(" + imagePath + ") no-repeat top left";
		this._track.appendChild(element);
					
		delta += this.imageWidth + this.spacing;
	}
}
