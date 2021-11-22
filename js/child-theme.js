/*!
  * Understrap v1.0.1 (https://understrap.com)
  * Copyright 2013-2021 The Understrap Authors (https://github.com/understrap/understrap/graphs/contributors)
  * Licensed under GPL (http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.understrap = {}, global.jQuery));
}(this, (function (exports, $) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

  const timeoutDuration$1 = (function(){
    const longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
    for (let i = 0; i < longerTimeoutBrowsers.length; i += 1) {
      if (isBrowser$1 && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
        return 1;
      }
    }
    return 0;
  }());

  function microtaskDebounce$1(fn) {
    let called = false;
    return () => {
      if (called) {
        return
      }
      called = true;
      window.Promise.resolve().then(() => {
        called = false;
        fn();
      });
    }
  }

  function taskDebounce$1(fn) {
    let scheduled = false;
    return () => {
      if (!scheduled) {
        scheduled = true;
        setTimeout(() => {
          scheduled = false;
          fn();
        }, timeoutDuration$1);
      }
    };
  }

  const supportsMicroTasks$1 = isBrowser$1 && window.Promise;


  /**
  * Create a debounced version of a method, that's asynchronously deferred
  * but called in the minimum time possible.
  *
  * @method
  * @memberof Popper.Utils
  * @argument {Function} fn
  * @returns {Function}
  */
  var debounce$1 = (supportsMicroTasks$1
    ? microtaskDebounce$1
    : taskDebounce$1);

  /**
   * Check if the given variable is a function
   * @method
   * @memberof Popper.Utils
   * @argument {Any} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */
  function isFunction$1(functionToCheck) {
    const getType = {};
    return (
      functionToCheck &&
      getType.toString.call(functionToCheck) === '[object Function]'
    );
  }

  /**
   * Get CSS computed property of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Eement} element
   * @argument {String} property
   */
  function getStyleComputedProperty$1(element, property) {
    if (element.nodeType !== 1) {
      return [];
    }
    // NOTE: 1 DOM access here
    const window = element.ownerDocument.defaultView;
    const css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
  }

  /**
   * Returns the parentNode or the host of the element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} parent
   */
  function getParentNode$1(element) {
    if (element.nodeName === 'HTML') {
      return element;
    }
    return element.parentNode || element.host;
  }

  /**
   * Returns the scrolling parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
  function getScrollParent$1(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (!element) {
      return document.body
    }

    switch (element.nodeName) {
      case 'HTML':
      case 'BODY':
        return element.ownerDocument.body
      case '#document':
        return element.body
    }

    // Firefox want us to check `-x` and `-y` variations as well
    const { overflow, overflowX, overflowY } = getStyleComputedProperty$1(element);
    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return element;
    }

    return getScrollParent$1(getParentNode$1(element));
  }

  /**
   * Returns the reference node of the reference object, or the reference object itself.
   * @method
   * @memberof Popper.Utils
   * @param {Element|Object} reference - the reference element (the popper will be relative to this)
   * @returns {Element} parent
   */
  function getReferenceNode$1(reference) {
    return reference && reference.referenceNode ? reference.referenceNode : reference;
  }

  const isIE11$1 = isBrowser$1 && !!(window.MSInputMethodContext && document.documentMode);
  const isIE10$1 = isBrowser$1 && /MSIE 10/.test(navigator.userAgent);

  /**
   * Determines if the browser is Internet Explorer
   * @method
   * @memberof Popper.Utils
   * @param {Number} version to check
   * @returns {Boolean} isIE
   */
  function isIE$1(version) {
    if (version === 11) {
      return isIE11$1;
    }
    if (version === 10) {
      return isIE10$1;
    }
    return isIE11$1 || isIE10$1;
  }

  /**
   * Returns the offset parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} offset parent
   */
  function getOffsetParent$1(element) {
    if (!element) {
      return document.documentElement;
    }

    const noOffsetParent = isIE$1(10) ? document.body : null;

    // NOTE: 1 DOM access here
    let offsetParent = element.offsetParent || null;
    // Skip hidden elements which don't have an offsetParent
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
      offsetParent = (element = element.nextElementSibling).offsetParent;
    }

    const nodeName = offsetParent && offsetParent.nodeName;

    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
      return element ? element.ownerDocument.documentElement : document.documentElement;
    }

    // .offsetParent will return the closest TH, TD or TABLE in case
    // no offsetParent is present, I hate this job...
    if (
      ['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 &&
      getStyleComputedProperty$1(offsetParent, 'position') === 'static'
    ) {
      return getOffsetParent$1(offsetParent);
    }

    return offsetParent;
  }

  function isOffsetContainer$1(element) {
    const { nodeName } = element;
    if (nodeName === 'BODY') {
      return false;
    }
    return (
      nodeName === 'HTML' || getOffsetParent$1(element.firstElementChild) === element
    );
  }

  /**
   * Finds the root node (document, shadowDOM root) of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} node
   * @returns {Element} root node
   */
  function getRoot$1(node) {
    if (node.parentNode !== null) {
      return getRoot$1(node.parentNode);
    }

    return node;
  }

  /**
   * Finds the offset parent common to the two provided nodes
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element1
   * @argument {Element} element2
   * @returns {Element} common offset parent
   */
  function findCommonOffsetParent$1(element1, element2) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
      return document.documentElement;
    }

    // Here we make sure to give as "start" the element that comes first in the DOM
    const order =
      element1.compareDocumentPosition(element2) &
      Node.DOCUMENT_POSITION_FOLLOWING;
    const start = order ? element1 : element2;
    const end = order ? element2 : element1;

    // Get common ancestor container
    const range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    const { commonAncestorContainer } = range;

    // Both nodes are inside #document
    if (
      (element1 !== commonAncestorContainer &&
        element2 !== commonAncestorContainer) ||
      start.contains(end)
    ) {
      if (isOffsetContainer$1(commonAncestorContainer)) {
        return commonAncestorContainer;
      }

      return getOffsetParent$1(commonAncestorContainer);
    }

    // one of the nodes is inside shadowDOM, find which one
    const element1root = getRoot$1(element1);
    if (element1root.host) {
      return findCommonOffsetParent$1(element1root.host, element2);
    } else {
      return findCommonOffsetParent$1(element1, getRoot$1(element2).host);
    }
  }

  /**
   * Gets the scroll value of the given element in the given side (top and left)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {String} side `top` or `left`
   * @returns {number} amount of scrolled pixels
   */
  function getScroll$1(element, side = 'top') {
    const upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    const nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      const html = element.ownerDocument.documentElement;
      const scrollingElement = element.ownerDocument.scrollingElement || html;
      return scrollingElement[upperSide];
    }

    return element[upperSide];
  }

  /*
   * Sum or subtract the element scroll values (left and top) from a given rect object
   * @method
   * @memberof Popper.Utils
   * @param {Object} rect - Rect object you want to change
   * @param {HTMLElement} element - The element from the function reads the scroll values
   * @param {Boolean} subtract - set to true if you want to subtract the scroll values
   * @return {Object} rect - The modifier rect object
   */
  function includeScroll$1(rect, element, subtract = false) {
    const scrollTop = getScroll$1(element, 'top');
    const scrollLeft = getScroll$1(element, 'left');
    const modifier = subtract ? -1 : 1;
    rect.top += scrollTop * modifier;
    rect.bottom += scrollTop * modifier;
    rect.left += scrollLeft * modifier;
    rect.right += scrollLeft * modifier;
    return rect;
  }

  /*
   * Helper to detect borders of a given element
   * @method
   * @memberof Popper.Utils
   * @param {CSSStyleDeclaration} styles
   * Result of `getStyleComputedProperty` on the given element
   * @param {String} axis - `x` or `y`
   * @return {number} borders - The borders size of the given axis
   */

  function getBordersSize$1(styles, axis) {
    const sideA = axis === 'x' ? 'Left' : 'Top';
    const sideB = sideA === 'Left' ? 'Right' : 'Bottom';

    return (
      parseFloat(styles[`border${sideA}Width`]) +
      parseFloat(styles[`border${sideB}Width`])
    );
  }

  function getSize$1(axis, body, html, computedStyle) {
    return Math.max(
      body[`offset${axis}`],
      body[`scroll${axis}`],
      html[`client${axis}`],
      html[`offset${axis}`],
      html[`scroll${axis}`],
      isIE$1(10)
        ? (parseInt(html[`offset${axis}`]) + 
        parseInt(computedStyle[`margin${axis === 'Height' ? 'Top' : 'Left'}`]) + 
        parseInt(computedStyle[`margin${axis === 'Height' ? 'Bottom' : 'Right'}`]))
      : 0 
    );
  }

  function getWindowSizes$1(document) {
    const body = document.body;
    const html = document.documentElement;
    const computedStyle = isIE$1(10) && getComputedStyle(html);

    return {
      height: getSize$1('Height', body, html, computedStyle),
      width: getSize$1('Width', body, html, computedStyle),
    };
  }

  /**
   * Given element offsets, generate an output similar to getBoundingClientRect
   * @method
   * @memberof Popper.Utils
   * @argument {Object} offsets
   * @returns {Object} ClientRect like output
   */
  function getClientRect$1(offsets) {
    return {
      ...offsets,
      right: offsets.left + offsets.width,
      bottom: offsets.top + offsets.height,
    };
  }

  /**
   * Get bounding client rect of given element
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} element
   * @return {Object} client rect
   */
  function getBoundingClientRect$1(element) {
    let rect = {};

    // IE10 10 FIX: Please, don't ask, the element isn't
    // considered in DOM in some circumstances...
    // This isn't reproducible in IE10 compatibility mode of IE11
    try {
      if (isIE$1(10)) {
        rect = element.getBoundingClientRect();
        const scrollTop = getScroll$1(element, 'top');
        const scrollLeft = getScroll$1(element, 'left');
        rect.top += scrollTop;
        rect.left += scrollLeft;
        rect.bottom += scrollTop;
        rect.right += scrollLeft;
      }
      else {
        rect = element.getBoundingClientRect();
      }
    }
    catch(e){}

    const result = {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top,
    };

    // subtract scrollbar size from sizes
    const sizes = element.nodeName === 'HTML' ? getWindowSizes$1(element.ownerDocument) : {};
    const width =
      sizes.width || element.clientWidth || result.width;
    const height =
      sizes.height || element.clientHeight || result.height;

    let horizScrollbar = element.offsetWidth - width;
    let vertScrollbar = element.offsetHeight - height;

    // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons
    if (horizScrollbar || vertScrollbar) {
      const styles = getStyleComputedProperty$1(element);
      horizScrollbar -= getBordersSize$1(styles, 'x');
      vertScrollbar -= getBordersSize$1(styles, 'y');

      result.width -= horizScrollbar;
      result.height -= vertScrollbar;
    }

    return getClientRect$1(result);
  }

  function getOffsetRectRelativeToArbitraryNode$1(children, parent, fixedPosition = false) {
    const isIE10 = isIE$1(10);
    const isHTML = parent.nodeName === 'HTML';
    const childrenRect = getBoundingClientRect$1(children);
    const parentRect = getBoundingClientRect$1(parent);
    const scrollParent = getScrollParent$1(children);

    const styles = getStyleComputedProperty$1(parent);
    const borderTopWidth = parseFloat(styles.borderTopWidth);
    const borderLeftWidth = parseFloat(styles.borderLeftWidth);

    // In cases where the parent is fixed, we must ignore negative scroll in offset calc
    if(fixedPosition && isHTML) {
      parentRect.top = Math.max(parentRect.top, 0);
      parentRect.left = Math.max(parentRect.left, 0);
    }
    let offsets = getClientRect$1({
      top: childrenRect.top - parentRect.top - borderTopWidth,
      left: childrenRect.left - parentRect.left - borderLeftWidth,
      width: childrenRect.width,
      height: childrenRect.height,
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0;

    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (!isIE10 && isHTML) {
      const marginTop = parseFloat(styles.marginTop);
      const marginLeft = parseFloat(styles.marginLeft);

      offsets.top -= borderTopWidth - marginTop;
      offsets.bottom -= borderTopWidth - marginTop;
      offsets.left -= borderLeftWidth - marginLeft;
      offsets.right -= borderLeftWidth - marginLeft;

      // Attach marginTop and marginLeft because in some circumstances we may need them
      offsets.marginTop = marginTop;
      offsets.marginLeft = marginLeft;
    }

    if (
      isIE10 && !fixedPosition
        ? parent.contains(scrollParent)
        : parent === scrollParent && scrollParent.nodeName !== 'BODY'
    ) {
      offsets = includeScroll$1(offsets, parent);
    }

    return offsets;
  }

  function getViewportOffsetRectRelativeToArtbitraryNode$1(element, excludeScroll = false) {
    const html = element.ownerDocument.documentElement;
    const relativeOffset = getOffsetRectRelativeToArbitraryNode$1(element, html);
    const width = Math.max(html.clientWidth, window.innerWidth || 0);
    const height = Math.max(html.clientHeight, window.innerHeight || 0);

    const scrollTop = !excludeScroll ? getScroll$1(html) : 0;
    const scrollLeft = !excludeScroll ? getScroll$1(html, 'left') : 0;

    const offset = {
      top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
      left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
      width,
      height,
    };

    return getClientRect$1(offset);
  }

  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */
  function isFixed$1(element) {
    const nodeName = element.nodeName;
    if (nodeName === 'BODY' || nodeName === 'HTML') {
      return false;
    }
    if (getStyleComputedProperty$1(element, 'position') === 'fixed') {
      return true;
    }
    const parentNode = getParentNode$1(element);
    if (!parentNode) {
      return false;
    }
    return isFixed$1(parentNode);
  }

  /**
   * Finds the first parent of an element that has a transformed property defined
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} first transformed parent or documentElement
   */

  function getFixedPositionOffsetParent$1(element) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
     if (!element || !element.parentElement || isIE$1()) {
      return document.documentElement;
    }
    let el = element.parentElement;
    while (el && getStyleComputedProperty$1(el, 'transform') === 'none') {
      el = el.parentElement;
    }
    return el || document.documentElement;

  }

  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} popper
   * @param {HTMLElement} reference
   * @param {number} padding
   * @param {HTMLElement} boundariesElement - Element used to define the boundaries
   * @param {Boolean} fixedPosition - Is in fixed position mode
   * @returns {Object} Coordinates of the boundaries
   */
  function getBoundaries$1(
    popper,
    reference,
    padding,
    boundariesElement,
    fixedPosition = false
  ) {
    // NOTE: 1 DOM access here

    let boundaries = { top: 0, left: 0 };
    const offsetParent = fixedPosition ? getFixedPositionOffsetParent$1(popper) : findCommonOffsetParent$1(popper, getReferenceNode$1(reference));

    // Handle viewport case
    if (boundariesElement === 'viewport' ) {
      boundaries = getViewportOffsetRectRelativeToArtbitraryNode$1(offsetParent, fixedPosition);
    }

    else {
      // Handle other cases based on DOM element used as boundaries
      let boundariesNode;
      if (boundariesElement === 'scrollParent') {
        boundariesNode = getScrollParent$1(getParentNode$1(reference));
        if (boundariesNode.nodeName === 'BODY') {
          boundariesNode = popper.ownerDocument.documentElement;
        }
      } else if (boundariesElement === 'window') {
        boundariesNode = popper.ownerDocument.documentElement;
      } else {
        boundariesNode = boundariesElement;
      }

      const offsets = getOffsetRectRelativeToArbitraryNode$1(
        boundariesNode,
        offsetParent,
        fixedPosition
      );

      // In case of HTML, we need a different computation
      if (boundariesNode.nodeName === 'HTML' && !isFixed$1(offsetParent)) {
        const { height, width } = getWindowSizes$1(popper.ownerDocument);
        boundaries.top += offsets.top - offsets.marginTop;
        boundaries.bottom = height + offsets.top;
        boundaries.left += offsets.left - offsets.marginLeft;
        boundaries.right = width + offsets.left;
      } else {
        // for all the other DOM elements, this one is good
        boundaries = offsets;
      }
    }

    // Add paddings
    padding = padding || 0;
    const isPaddingNumber = typeof padding === 'number';
    boundaries.left += isPaddingNumber ? padding : padding.left || 0; 
    boundaries.top += isPaddingNumber ? padding : padding.top || 0; 
    boundaries.right -= isPaddingNumber ? padding : padding.right || 0; 
    boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0; 

    return boundaries;
  }

  function getArea$1({ width, height }) {
    return width * height;
  }

  /**
   * Utility used to transform the `auto` placement to the placement with more
   * available space.
   * @method
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeAutoPlacement$1(
    placement,
    refRect,
    popper,
    reference,
    boundariesElement,
    padding = 0
  ) {
    if (placement.indexOf('auto') === -1) {
      return placement;
    }

    const boundaries = getBoundaries$1(
      popper,
      reference,
      padding,
      boundariesElement
    );

    const rects = {
      top: {
        width: boundaries.width,
        height: refRect.top - boundaries.top,
      },
      right: {
        width: boundaries.right - refRect.right,
        height: boundaries.height,
      },
      bottom: {
        width: boundaries.width,
        height: boundaries.bottom - refRect.bottom,
      },
      left: {
        width: refRect.left - boundaries.left,
        height: boundaries.height,
      },
    };

    const sortedAreas = Object.keys(rects)
      .map(key => ({
        key,
        ...rects[key],
        area: getArea$1(rects[key]),
      }))
      .sort((a, b) => b.area - a.area);

    const filteredAreas = sortedAreas.filter(
      ({ width, height }) =>
        width >= popper.clientWidth && height >= popper.clientHeight
    );

    const computedPlacement = filteredAreas.length > 0
      ? filteredAreas[0].key
      : sortedAreas[0].key;

    const variation = placement.split('-')[1];

    return computedPlacement + (variation ? `-${variation}` : '');
  }

  /**
   * Get offsets to the reference element
   * @method
   * @memberof Popper.Utils
   * @param {Object} state
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @param {Element} fixedPosition - is in fixed position mode
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */
  function getReferenceOffsets$1(state, popper, reference, fixedPosition = null) {
    const commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent$1(popper) : findCommonOffsetParent$1(popper, getReferenceNode$1(reference));
    return getOffsetRectRelativeToArbitraryNode$1(reference, commonOffsetParent, fixedPosition);
  }

  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */
  function getOuterSizes$1(element) {
    const window = element.ownerDocument.defaultView;
    const styles = window.getComputedStyle(element);
    const x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
    const y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
    const result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x,
    };
    return result;
  }

  /**
   * Get the opposite placement of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement
   * @returns {String} flipped placement
   */
  function getOppositePlacement$1(placement) {
    const hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    return placement.replace(/left|right|bottom|top/g, matched => hash[matched]);
  }

  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper.Utils
   * @param {Object} position - CSS position the Popper will get applied
   * @param {HTMLElement} popper - the popper element
   * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
   * @param {String} placement - one of the valid placement options
   * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
   */
  function getPopperOffsets$1(popper, referenceOffsets, placement) {
    placement = placement.split('-')[0];

    // Get popper node sizes
    const popperRect = getOuterSizes$1(popper);

    // Add position, width and height to our offsets object
    const popperOffsets = {
      width: popperRect.width,
      height: popperRect.height,
    };

    // depending by the popper placement we have to compute its offsets slightly differently
    const isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    const mainSide = isHoriz ? 'top' : 'left';
    const secondarySide = isHoriz ? 'left' : 'top';
    const measurement = isHoriz ? 'height' : 'width';
    const secondaryMeasurement = !isHoriz ? 'height' : 'width';

    popperOffsets[mainSide] =
      referenceOffsets[mainSide] +
      referenceOffsets[measurement] / 2 -
      popperRect[measurement] / 2;
    if (placement === secondarySide) {
      popperOffsets[secondarySide] =
        referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      popperOffsets[secondarySide] =
        referenceOffsets[getOppositePlacement$1(secondarySide)];
    }

    return popperOffsets;
  }

  /**
   * Mimics the `find` method of Array
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function find$1(arr, check) {
    // use native find if supported
    if (Array.prototype.find) {
      return arr.find(check);
    }

    // use `filter` to obtain the same behavior of `find`
    return arr.filter(check)[0];
  }

  /**
   * Return the index of the matching object
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function findIndex$1(arr, prop, value) {
    // use native findIndex if supported
    if (Array.prototype.findIndex) {
      return arr.findIndex(cur => cur[prop] === value);
    }

    // use `find` + `indexOf` if `findIndex` isn't supported
    const match = find$1(arr, obj => obj[prop] === value);
    return arr.indexOf(match);
  }

  /**
   * Loop trough the list of modifiers and run them in order,
   * each of them will then edit the data object.
   * @method
   * @memberof Popper.Utils
   * @param {dataObject} data
   * @param {Array} modifiers
   * @param {String} ends - Optional modifier name used as stopper
   * @returns {dataObject}
   */
  function runModifiers$1(modifiers, data, ends) {
    const modifiersToRun = ends === undefined
      ? modifiers
      : modifiers.slice(0, findIndex$1(modifiers, 'name', ends));

    modifiersToRun.forEach(modifier => {
      if (modifier['function']) { // eslint-disable-line dot-notation
        console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
      }
      const fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
      if (modifier.enabled && isFunction$1(fn)) {
        // Add properties to offsets to make them a complete clientRect object
        // we do this before each modifier to make sure the previous one doesn't
        // mess with these values
        data.offsets.popper = getClientRect$1(data.offsets.popper);
        data.offsets.reference = getClientRect$1(data.offsets.reference);

        data = fn(data, modifier);
      }
    });

    return data;
  }

  /**
   * Updates the position of the popper, computing the new offsets and applying
   * the new style.<br />
   * Prefer `scheduleUpdate` over `update` because of performance reasons.
   * @method
   * @memberof Popper
   */
  function update$1() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    let data = {
      instance: this,
      styles: {},
      arrowStyles: {},
      attributes: {},
      flipped: false,
      offsets: {},
    };

    // compute reference element offsets
    data.offsets.reference = getReferenceOffsets$1(
      this.state,
      this.popper,
      this.reference,
      this.options.positionFixed
    );

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    data.placement = computeAutoPlacement$1(
      this.options.placement,
      data.offsets.reference,
      this.popper,
      this.reference,
      this.options.modifiers.flip.boundariesElement,
      this.options.modifiers.flip.padding
    );

    // store the computed placement inside `originalPlacement`
    data.originalPlacement = data.placement;

    data.positionFixed = this.options.positionFixed;

    // compute the popper offsets
    data.offsets.popper = getPopperOffsets$1(
      this.popper,
      data.offsets.reference,
      data.placement
    );

    data.offsets.popper.position = this.options.positionFixed
      ? 'fixed'
      : 'absolute';

    // run the modifiers
    data = runModifiers$1(this.modifiers, data);

    // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback
    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }

  /**
   * Helper used to know if the given modifier is enabled.
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean}
   */
  function isModifierEnabled$1(modifiers, modifierName) {
    return modifiers.some(
      ({ name, enabled }) => enabled && name === modifierName
    );
  }

  /**
   * Get the prefixed supported property name
   * @method
   * @memberof Popper.Utils
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
   */
  function getSupportedPropertyName$1(property) {
    const prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
    const upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (let i = 0; i < prefixes.length; i++) {
      const prefix = prefixes[i];
      const toCheck = prefix ? `${prefix}${upperProp}` : property;
      if (typeof document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }
    return null;
  }

  /**
   * Destroys the popper.
   * @method
   * @memberof Popper
   */
  function destroy$1() {
    this.state.isDestroyed = true;

    // touch DOM only if `applyStyle` modifier is enabled
    if (isModifierEnabled$1(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style.left = '';
      this.popper.style.right = '';
      this.popper.style.bottom = '';
      this.popper.style.willChange = '';
      this.popper.style[getSupportedPropertyName$1('transform')] = '';
    }

    this.disableEventListeners();

    // remove the popper if user explicitly asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it
    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }
    return this;
  }

  /**
   * Get the window associated with the element
   * @argument {Element} element
   * @returns {Window}
   */
  function getWindow$1(element) {
    const ownerDocument = element.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  function attachToScrollParents$1(scrollParent, event, callback, scrollParents) {
    const isBody = scrollParent.nodeName === 'BODY';
    const target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
    target.addEventListener(event, callback, { passive: true });

    if (!isBody) {
      attachToScrollParents$1(
        getScrollParent$1(target.parentNode),
        event,
        callback,
        scrollParents
      );
    }
    scrollParents.push(target);
  }

  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function setupEventListeners$1(
    reference,
    options,
    state,
    updateBound
  ) {
    // Resize event listener on window
    state.updateBound = updateBound;
    getWindow$1(reference).addEventListener('resize', state.updateBound, { passive: true });

    // Scroll event listener on scroll parents
    const scrollElement = getScrollParent$1(reference);
    attachToScrollParents$1(
      scrollElement,
      'scroll',
      state.updateBound,
      state.scrollParents
    );
    state.scrollElement = scrollElement;
    state.eventsEnabled = true;

    return state;
  }

  /**
   * It will add resize/scroll events and start recalculating
   * position of the popper element when they are triggered.
   * @method
   * @memberof Popper
   */
  function enableEventListeners$1() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners$1(
        this.reference,
        this.options,
        this.state,
        this.scheduleUpdate
      );
    }
  }

  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function removeEventListeners$1(reference, state) {
    // Remove resize event listener on window
    getWindow$1(reference).removeEventListener('resize', state.updateBound);

    // Remove scroll event listener on scroll parents
    state.scrollParents.forEach(target => {
      target.removeEventListener('scroll', state.updateBound);
    });

    // Reset state
    state.updateBound = null;
    state.scrollParents = [];
    state.scrollElement = null;
    state.eventsEnabled = false;
    return state;
  }

  /**
   * It will remove resize/scroll events and won't recalculate popper position
   * when they are triggered. It also won't trigger `onUpdate` callback anymore,
   * unless you call `update` method manually.
   * @method
   * @memberof Popper
   */
  function disableEventListeners$1() {
    if (this.state.eventsEnabled) {
      cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners$1(this.reference, this.state);
    }
  }

  /**
   * Tells if a given input is a number
   * @method
   * @memberof Popper.Utils
   * @param {*} input to check
   * @return {Boolean}
   */
  function isNumeric$1(n) {
    return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Set the style to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setStyles$1(element, styles) {
    Object.keys(styles).forEach(prop => {
      let unit = '';
      // add unit if the value is numeric and is one of the following
      if (
        ['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !==
          -1 &&
        isNumeric$1(styles[prop])
      ) {
        unit = 'px';
      }
      element.style[prop] = styles[prop] + unit;
    });
  }

  /**
   * Set the attributes to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the attributes to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setAttributes$1(element, attributes) {
    Object.keys(attributes).forEach(function(prop) {
      const value = attributes[prop];
      if (value !== false) {
        element.setAttribute(prop, attributes[prop]);
      } else {
        element.removeAttribute(prop);
      }
    });
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} data.styles - List of style properties - values to apply to popper element
   * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The same data object
   */
  function applyStyle$1(data) {
    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    setStyles$1(data.instance.popper, data.styles);

    // any property present in `data.attributes` will be applied to the popper,
    // they will be set as HTML attributes of the element
    setAttributes$1(data.instance.popper, data.attributes);

    // if arrowElement is defined and arrowStyles has some properties
    if (data.arrowElement && Object.keys(data.arrowStyles).length) {
      setStyles$1(data.arrowElement, data.arrowStyles);
    }

    return data;
  }

  /**
   * Set the x-placement attribute before everything else because it could be used
   * to add margins to the popper margins needs to be calculated to get the
   * correct popper offsets.
   * @method
   * @memberof Popper.modifiers
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper
   * @param {Object} options - Popper.js options
   */
  function applyStyleOnLoad$1(
    reference,
    popper,
    options,
    modifierOptions,
    state
  ) {
    // compute reference element offsets
    const referenceOffsets = getReferenceOffsets$1(state, popper, reference, options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    const placement = computeAutoPlacement$1(
      options.placement,
      referenceOffsets,
      popper,
      reference,
      options.modifiers.flip.boundariesElement,
      options.modifiers.flip.padding
    );

    popper.setAttribute('x-placement', placement);

    // Apply `position` to popper before anything else because
    // without the position applied we can't guarantee correct computations
    setStyles$1(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

    return options;
  }

  /**
   * @function
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Boolean} shouldRound - If the offsets should be rounded at all
   * @returns {Object} The popper's position offsets rounded
   *
   * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
   * good as it can be within reason.
   * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
   *
   * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
   * as well on High DPI screens).
   *
   * Firefox prefers no rounding for positioning and does not have blurriness on
   * high DPI screens.
   *
   * Only horizontal placement and left/right values need to be considered.
   */
  function getRoundedOffsets$1(data, shouldRound) {
    const { popper, reference } = data.offsets;
    const { round, floor } = Math;
    const noRound = v => v;
    
    const referenceWidth = round(reference.width);
    const popperWidth = round(popper.width);
    
    const isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
    const isVariation = data.placement.indexOf('-') !== -1;
    const sameWidthParity = referenceWidth % 2 === popperWidth % 2;
    const bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

    const horizontalToInteger = !shouldRound
      ? noRound
      : isVertical || isVariation || sameWidthParity
      ? round
      : floor;
    const verticalToInteger = !shouldRound ? noRound : round;

    return {
      left: horizontalToInteger(
        bothOddWidth && !isVariation && shouldRound
          ? popper.left - 1
          : popper.left
      ),
      top: verticalToInteger(popper.top),
      bottom: verticalToInteger(popper.bottom),
      right: horizontalToInteger(popper.right),
    };
  }

  const isFirefox$1 = isBrowser$1 && /Firefox/i.test(navigator.userAgent);

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeStyle$1(data, options) {
    const { x, y } = options;
    const { popper } = data.offsets;

    // Remove this legacy support in Popper.js v2
    const legacyGpuAccelerationOption = find$1(
      data.instance.modifiers,
      modifier => modifier.name === 'applyStyle'
    ).gpuAcceleration;
    if (legacyGpuAccelerationOption !== undefined) {
      console.warn(
        'WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!'
      );
    }
    const gpuAcceleration =
      legacyGpuAccelerationOption !== undefined
        ? legacyGpuAccelerationOption
        : options.gpuAcceleration;

    const offsetParent = getOffsetParent$1(data.instance.popper);
    const offsetParentRect = getBoundingClientRect$1(offsetParent);

    // Styles
    const styles = {
      position: popper.position,
    };

    const offsets = getRoundedOffsets$1(
      data,
      window.devicePixelRatio < 2 || !isFirefox$1
    );

    const sideA = x === 'bottom' ? 'top' : 'bottom';
    const sideB = y === 'right' ? 'left' : 'right';

    // if gpuAcceleration is set to `true` and transform is supported,
    //  we use `translate3d` to apply the position to the popper we
    // automatically use the supported prefixed version if needed
    const prefixedProperty = getSupportedPropertyName$1('transform');

    // now, let's make a step back and look at this code closely (wtf?)
    // If the content of the popper grows once it's been positioned, it
    // may happen that the popper gets misplaced because of the new content
    // overflowing its reference element
    // To avoid this problem, we provide two options (x and y), which allow
    // the consumer to define the offset origin.
    // If we position a popper on top of a reference element, we can set
    // `x` to `top` to make the popper grow towards its top instead of
    // its bottom.
    let left, top;
    if (sideA === 'bottom') {
      // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
      // and not the bottom of the html element
      if (offsetParent.nodeName === 'HTML') {
        top = -offsetParent.clientHeight + offsets.bottom;
      } else {
        top = -offsetParentRect.height + offsets.bottom;
      }
    } else {
      top = offsets.top;
    }
    if (sideB === 'right') {
      if (offsetParent.nodeName === 'HTML') {
        left = -offsetParent.clientWidth + offsets.right;
      } else {
        left = -offsetParentRect.width + offsets.right;
      }
    } else {
      left = offsets.left;
    }
    if (gpuAcceleration && prefixedProperty) {
      styles[prefixedProperty] = `translate3d(${left}px, ${top}px, 0)`;
      styles[sideA] = 0;
      styles[sideB] = 0;
      styles.willChange = 'transform';
    } else {
      // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
      const invertTop = sideA === 'bottom' ? -1 : 1;
      const invertLeft = sideB === 'right' ? -1 : 1;
      styles[sideA] = top * invertTop;
      styles[sideB] = left * invertLeft;
      styles.willChange = `${sideA}, ${sideB}`;
    }

    // Attributes
    const attributes = {
      'x-placement': data.placement,
    };

    // Update `data` attributes, styles and arrowStyles
    data.attributes = { ...attributes, ...data.attributes };
    data.styles = { ...styles, ...data.styles };
    data.arrowStyles = { ...data.offsets.arrow, ...data.arrowStyles };

    return data;
  }

  /**
   * Helper used to know if the given modifier depends from another one.<br />
   * It checks if the needed modifier is listed and enabled.
   * @method
   * @memberof Popper.Utils
   * @param {Array} modifiers - list of modifiers
   * @param {String} requestingName - name of requesting modifier
   * @param {String} requestedName - name of requested modifier
   * @returns {Boolean}
   */
  function isModifierRequired$1(
    modifiers,
    requestingName,
    requestedName
  ) {
    const requesting = find$1(modifiers, ({ name }) => name === requestingName);

    const isRequired =
      !!requesting &&
      modifiers.some(modifier => {
        return (
          modifier.name === requestedName &&
          modifier.enabled &&
          modifier.order < requesting.order
        );
      });

    if (!isRequired) {
      const requesting = `\`${requestingName}\``;
      const requested = `\`${requestedName}\``;
      console.warn(
        `${requested} modifier is required by ${requesting} modifier in order to work, be sure to include it before ${requesting}!`
      );
    }
    return isRequired;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function arrow$1(data, options) {
    // arrow depends on keepTogether in order to work
    if (!isModifierRequired$1(data.instance.modifiers, 'arrow', 'keepTogether')) {
      return data;
    }

    let arrowElement = options.element;

    // if arrowElement is a string, suppose it's a CSS selector
    if (typeof arrowElement === 'string') {
      arrowElement = data.instance.popper.querySelector(arrowElement);

      // if arrowElement is not found, don't run the modifier
      if (!arrowElement) {
        return data;
      }
    } else {
      // if the arrowElement isn't a query selector we must check that the
      // provided DOM node is child of its popper node
      if (!data.instance.popper.contains(arrowElement)) {
        console.warn(
          'WARNING: `arrow.element` must be child of its popper element!'
        );
        return data;
      }
    }

    const placement = data.placement.split('-')[0];
    const { popper, reference } = data.offsets;
    const isVertical = ['left', 'right'].indexOf(placement) !== -1;

    const len = isVertical ? 'height' : 'width';
    const sideCapitalized = isVertical ? 'Top' : 'Left';
    const side = sideCapitalized.toLowerCase();
    const altSide = isVertical ? 'left' : 'top';
    const opSide = isVertical ? 'bottom' : 'right';
    const arrowElementSize = getOuterSizes$1(arrowElement)[len];

    //
    // extends keepTogether behavior making sure the popper and its
    // reference have enough pixels in conjunction
    //

    // top/left side
    if (reference[opSide] - arrowElementSize < popper[side]) {
      data.offsets.popper[side] -=
        popper[side] - (reference[opSide] - arrowElementSize);
    }
    // bottom/right side
    if (reference[side] + arrowElementSize > popper[opSide]) {
      data.offsets.popper[side] +=
        reference[side] + arrowElementSize - popper[opSide];
    }
    data.offsets.popper = getClientRect$1(data.offsets.popper);

    // compute center of the popper
    const center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

    // Compute the sideValue using the updated popper offsets
    // take popper margin in account because we don't have this info available
    const css = getStyleComputedProperty$1(data.instance.popper);
    const popperMarginSide = parseFloat(css[`margin${sideCapitalized}`]);
    const popperBorderSide = parseFloat(css[`border${sideCapitalized}Width`]);
    let sideValue =
      center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

    // prevent arrowElement from being placed not contiguously to its popper
    sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

    data.arrowElement = arrowElement;
    data.offsets.arrow = {
      [side]: Math.round(sideValue),
      [altSide]: '', // make sure to unset any eventual altSide value from the DOM node
    };

    return data;
  }

  /**
   * Get the opposite placement variation of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement variation
   * @returns {String} flipped placement variation
   */
  function getOppositeVariation$1(variation) {
    if (variation === 'end') {
      return 'start';
    } else if (variation === 'start') {
      return 'end';
    }
    return variation;
  }

  /**
   * List of accepted placements to use as values of the `placement` option.<br />
   * Valid placements are:
   * - `auto`
   * - `top`
   * - `right`
   * - `bottom`
   * - `left`
   *
   * Each placement can have a variation from this list:
   * - `-start`
   * - `-end`
   *
   * Variations are interpreted easily if you think of them as the left to right
   * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
   * is right.<br />
   * Vertically (`left` and `right`), `start` is top and `end` is bottom.
   *
   * Some valid examples are:
   * - `top-end` (on top of reference, right aligned)
   * - `right-start` (on right of reference, top aligned)
   * - `bottom` (on bottom, centered)
   * - `auto-end` (on the side with more space available, alignment depends by placement)
   *
   * @static
   * @type {Array}
   * @enum {String}
   * @readonly
   * @method placements
   * @memberof Popper
   */
  var placements$1 = [
    'auto-start',
    'auto',
    'auto-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-end',
    'bottom',
    'bottom-start',
    'left-end',
    'left',
    'left-start',
  ];

  // Get rid of `auto` `auto-start` and `auto-end`
  const validPlacements$1 = placements$1.slice(3);

  /**
   * Given an initial placement, returns all the subsequent placements
   * clockwise (or counter-clockwise).
   *
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement - A valid placement (it accepts variations)
   * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
   * @returns {Array} placements including their variations
   */
  function clockwise$1(placement, counter = false) {
    const index = validPlacements$1.indexOf(placement);
    const arr = validPlacements$1
      .slice(index + 1)
      .concat(validPlacements$1.slice(0, index));
    return counter ? arr.reverse() : arr;
  }

  const BEHAVIORS$1 = {
    FLIP: 'flip',
    CLOCKWISE: 'clockwise',
    COUNTERCLOCKWISE: 'counterclockwise',
  };

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function flip$1(data, options) {
    // if `inner` modifier is enabled, we can't use the `flip` modifier
    if (isModifierEnabled$1(data.instance.modifiers, 'inner')) {
      return data;
    }

    if (data.flipped && data.placement === data.originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    const boundaries = getBoundaries$1(
      data.instance.popper,
      data.instance.reference,
      options.padding,
      options.boundariesElement,
      data.positionFixed
    );

    let placement = data.placement.split('-')[0];
    let placementOpposite = getOppositePlacement$1(placement);
    let variation = data.placement.split('-')[1] || '';

    let flipOrder = [];

    switch (options.behavior) {
      case BEHAVIORS$1.FLIP:
        flipOrder = [placement, placementOpposite];
        break;
      case BEHAVIORS$1.CLOCKWISE:
        flipOrder = clockwise$1(placement);
        break;
      case BEHAVIORS$1.COUNTERCLOCKWISE:
        flipOrder = clockwise$1(placement, true);
        break;
      default:
        flipOrder = options.behavior;
    }

    flipOrder.forEach((step, index) => {
      if (placement !== step || flipOrder.length === index + 1) {
        return data;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement$1(placement);

      const popperOffsets = data.offsets.popper;
      const refOffsets = data.offsets.reference;

      // using floor because the reference offsets may contain decimals we are not going to consider here
      const floor = Math.floor;
      const overlapsRef =
        (placement === 'left' &&
          floor(popperOffsets.right) > floor(refOffsets.left)) ||
        (placement === 'right' &&
          floor(popperOffsets.left) < floor(refOffsets.right)) ||
        (placement === 'top' &&
          floor(popperOffsets.bottom) > floor(refOffsets.top)) ||
        (placement === 'bottom' &&
          floor(popperOffsets.top) < floor(refOffsets.bottom));

      const overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
      const overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
      const overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
      const overflowsBottom =
        floor(popperOffsets.bottom) > floor(boundaries.bottom);

      const overflowsBoundaries =
        (placement === 'left' && overflowsLeft) ||
        (placement === 'right' && overflowsRight) ||
        (placement === 'top' && overflowsTop) ||
        (placement === 'bottom' && overflowsBottom);

      // flip the variation if required
      const isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

      // flips variation if reference element overflows boundaries
      const flippedVariationByRef =
        !!options.flipVariations &&
        ((isVertical && variation === 'start' && overflowsLeft) ||
          (isVertical && variation === 'end' && overflowsRight) ||
          (!isVertical && variation === 'start' && overflowsTop) ||
          (!isVertical && variation === 'end' && overflowsBottom));

      // flips variation if popper content overflows boundaries
      const flippedVariationByContent =
        !!options.flipVariationsByContent &&
        ((isVertical && variation === 'start' && overflowsRight) ||
          (isVertical && variation === 'end' && overflowsLeft) ||
          (!isVertical && variation === 'start' && overflowsBottom) ||
          (!isVertical && variation === 'end' && overflowsTop));

      const flippedVariation = flippedVariationByRef || flippedVariationByContent;

      if (overlapsRef || overflowsBoundaries || flippedVariation) {
        // this boolean to detect any flip loop
        data.flipped = true;

        if (overlapsRef || overflowsBoundaries) {
          placement = flipOrder[index + 1];
        }

        if (flippedVariation) {
          variation = getOppositeVariation$1(variation);
        }

        data.placement = placement + (variation ? '-' + variation : '');

        // this object contains `position`, we want to preserve it along with
        // any additional property we may add in the future
        data.offsets.popper = {
          ...data.offsets.popper,
          ...getPopperOffsets$1(
            data.instance.popper,
            data.offsets.reference,
            data.placement
          ),
        };

        data = runModifiers$1(data.instance.modifiers, data, 'flip');
      }
    });
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function keepTogether$1(data) {
    const { popper, reference } = data.offsets;
    const placement = data.placement.split('-')[0];
    const floor = Math.floor;
    const isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    const side = isVertical ? 'right' : 'bottom';
    const opSide = isVertical ? 'left' : 'top';
    const measurement = isVertical ? 'width' : 'height';

    if (popper[side] < floor(reference[opSide])) {
      data.offsets.popper[opSide] =
        floor(reference[opSide]) - popper[measurement];
    }
    if (popper[opSide] > floor(reference[side])) {
      data.offsets.popper[opSide] = floor(reference[side]);
    }

    return data;
  }

  /**
   * Converts a string containing value + unit into a px value number
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} str - Value + unit string
   * @argument {String} measurement - `height` or `width`
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @returns {Number|String}
   * Value in pixels, or original string if no values were extracted
   */
  function toValue$1(str, measurement, popperOffsets, referenceOffsets) {
    // separate value from unit
    const split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
    const value = +split[1];
    const unit = split[2];

    // If it's not a number it's an operator, I guess
    if (!value) {
      return str;
    }

    if (unit.indexOf('%') === 0) {
      let element;
      switch (unit) {
        case '%p':
          element = popperOffsets;
          break;
        case '%':
        case '%r':
        default:
          element = referenceOffsets;
      }

      const rect = getClientRect$1(element);
      return rect[measurement] / 100 * value;
    } else if (unit === 'vh' || unit === 'vw') {
      // if is a vh or vw, we calculate the size based on the viewport
      let size;
      if (unit === 'vh') {
        size = Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        );
      } else {
        size = Math.max(
          document.documentElement.clientWidth,
          window.innerWidth || 0
        );
      }
      return size / 100 * value;
    } else {
      // if is an explicit pixel unit, we get rid of the unit and keep the value
      // if is an implicit unit, it's px, and we return just the value
      return value;
    }
  }

  /**
   * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} offset
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @argument {String} basePlacement
   * @returns {Array} a two cells array with x and y offsets in numbers
   */
  function parseOffset$1(
    offset,
    popperOffsets,
    referenceOffsets,
    basePlacement
  ) {
    const offsets = [0, 0];

    // Use height if placement is left or right and index is 0 otherwise use width
    // in this way the first offset will use an axis and the second one
    // will use the other one
    const useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

    // Split the offset string to obtain a list of values and operands
    // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
    const fragments = offset.split(/(\+|\-)/).map(frag => frag.trim());

    // Detect if the offset string contains a pair of values or a single one
    // they could be separated by comma or space
    const divider = fragments.indexOf(
      find$1(fragments, frag => frag.search(/,|\s/) !== -1)
    );

    if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
      console.warn(
        'Offsets separated by white space(s) are deprecated, use a comma (,) instead.'
      );
    }

    // If divider is found, we divide the list of values and operands to divide
    // them by ofset X and Y.
    const splitRegex = /\s*,\s*|\s+/;
    let ops = divider !== -1
      ? [
          fragments
            .slice(0, divider)
            .concat([fragments[divider].split(splitRegex)[0]]),
          [fragments[divider].split(splitRegex)[1]].concat(
            fragments.slice(divider + 1)
          ),
        ]
      : [fragments];

    // Convert the values with units to absolute pixels to allow our computations
    ops = ops.map((op, index) => {
      // Most of the units rely on the orientation of the popper
      const measurement = (index === 1 ? !useHeight : useHeight)
        ? 'height'
        : 'width';
      let mergeWithPrevious = false;
      return (
        op
          // This aggregates any `+` or `-` sign that aren't considered operators
          // e.g.: 10 + +5 => [10, +, +5]
          .reduce((a, b) => {
            if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
              a[a.length - 1] = b;
              mergeWithPrevious = true;
              return a;
            } else if (mergeWithPrevious) {
              a[a.length - 1] += b;
              mergeWithPrevious = false;
              return a;
            } else {
              return a.concat(b);
            }
          }, [])
          // Here we convert the string values into number values (in px)
          .map(str => toValue$1(str, measurement, popperOffsets, referenceOffsets))
      );
    });

    // Loop trough the offsets arrays and execute the operations
    ops.forEach((op, index) => {
      op.forEach((frag, index2) => {
        if (isNumeric$1(frag)) {
          offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        }
      });
    });
    return offsets;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @argument {Number|String} options.offset=0
   * The offset value as described in the modifier description
   * @returns {Object} The data object, properly modified
   */
  function offset$1(data, { offset }) {
    const { placement, offsets: { popper, reference } } = data;
    const basePlacement = placement.split('-')[0];

    let offsets;
    if (isNumeric$1(+offset)) {
      offsets = [+offset, 0];
    } else {
      offsets = parseOffset$1(offset, popper, reference, basePlacement);
    }

    if (basePlacement === 'left') {
      popper.top += offsets[0];
      popper.left -= offsets[1];
    } else if (basePlacement === 'right') {
      popper.top += offsets[0];
      popper.left += offsets[1];
    } else if (basePlacement === 'top') {
      popper.left += offsets[0];
      popper.top -= offsets[1];
    } else if (basePlacement === 'bottom') {
      popper.left += offsets[0];
      popper.top += offsets[1];
    }

    data.popper = popper;
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function preventOverflow$1(data, options) {
    let boundariesElement =
      options.boundariesElement || getOffsetParent$1(data.instance.popper);

    // If offsetParent is the reference element, we really want to
    // go one step up and use the next offsetParent as reference to
    // avoid to make this modifier completely useless and look like broken
    if (data.instance.reference === boundariesElement) {
      boundariesElement = getOffsetParent$1(boundariesElement);
    }

    // NOTE: DOM access here
    // resets the popper's position so that the document size can be calculated excluding
    // the size of the popper element itself
    const transformProp = getSupportedPropertyName$1('transform');
    const popperStyles = data.instance.popper.style; // assignment to help minification
    const { top, left, [transformProp]: transform } = popperStyles;
    popperStyles.top = '';
    popperStyles.left = '';
    popperStyles[transformProp] = '';

    const boundaries = getBoundaries$1(
      data.instance.popper,
      data.instance.reference,
      options.padding,
      boundariesElement,
      data.positionFixed
    );

    // NOTE: DOM access here
    // restores the original style properties after the offsets have been computed
    popperStyles.top = top;
    popperStyles.left = left;
    popperStyles[transformProp] = transform;

    options.boundaries = boundaries;

    const order = options.priority;
    let popper = data.offsets.popper;

    const check = {
      primary(placement) {
        let value = popper[placement];
        if (
          popper[placement] < boundaries[placement] &&
          !options.escapeWithReference
        ) {
          value = Math.max(popper[placement], boundaries[placement]);
        }
        return { [placement]: value };
      },
      secondary(placement) {
        const mainSide = placement === 'right' ? 'left' : 'top';
        let value = popper[mainSide];
        if (
          popper[placement] > boundaries[placement] &&
          !options.escapeWithReference
        ) {
          value = Math.min(
            popper[mainSide],
            boundaries[placement] -
              (placement === 'right' ? popper.width : popper.height)
          );
        }
        return { [mainSide]: value };
      },
    };

    order.forEach(placement => {
      const side =
        ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
      popper = { ...popper, ...check[side](placement) };
    });

    data.offsets.popper = popper;

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function shift$1(data) {
    const placement = data.placement;
    const basePlacement = placement.split('-')[0];
    const shiftvariation = placement.split('-')[1];

    // if shift shiftvariation is specified, run the modifier
    if (shiftvariation) {
      const { reference, popper } = data.offsets;
      const isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
      const side = isVertical ? 'left' : 'top';
      const measurement = isVertical ? 'width' : 'height';

      const shiftOffsets = {
        start: { [side]: reference[side] },
        end: {
          [side]: reference[side] + reference[measurement] - popper[measurement],
        },
      };

      data.offsets.popper = { ...popper, ...shiftOffsets[shiftvariation] };
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function hide$1(data) {
    if (!isModifierRequired$1(data.instance.modifiers, 'hide', 'preventOverflow')) {
      return data;
    }

    const refRect = data.offsets.reference;
    const bound = find$1(
      data.instance.modifiers,
      modifier => modifier.name === 'preventOverflow'
    ).boundaries;

    if (
      refRect.bottom < bound.top ||
      refRect.left > bound.right ||
      refRect.top > bound.bottom ||
      refRect.right < bound.left
    ) {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === true) {
        return data;
      }

      data.hide = true;
      data.attributes['x-out-of-boundaries'] = '';
    } else {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === false) {
        return data;
      }

      data.hide = false;
      data.attributes['x-out-of-boundaries'] = false;
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function inner$1(data) {
    const placement = data.placement;
    const basePlacement = placement.split('-')[0];
    const { popper, reference } = data.offsets;
    const isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

    const subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

    popper[isHoriz ? 'left' : 'top'] =
      reference[basePlacement] -
      (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

    data.placement = getOppositePlacement$1(placement);
    data.offsets.popper = getClientRect$1(popper);

    return data;
  }

  /**
   * Modifier function, each modifier can have a function of this type assigned
   * to its `fn` property.<br />
   * These functions will be called on each update, this means that you must
   * make sure they are performant enough to avoid performance bottlenecks.
   *
   * @function ModifierFn
   * @argument {dataObject} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {dataObject} The data object, properly modified
   */

  /**
   * Modifiers are plugins used to alter the behavior of your poppers.<br />
   * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
   * needed by the library.
   *
   * Usually you don't want to override the `order`, `fn` and `onLoad` props.
   * All the other properties are configurations that could be tweaked.
   * @namespace modifiers
   */
  var modifiers$1 = {
    /**
     * Modifier used to shift the popper on the start or end of its reference
     * element.<br />
     * It will read the variation of the `placement` property.<br />
     * It can be one either `-end` or `-start`.
     * @memberof modifiers
     * @inner
     */
    shift: {
      /** @prop {number} order=100 - Index used to define the order of execution */
      order: 100,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: shift$1,
    },

    /**
     * The `offset` modifier can shift your popper on both its axis.
     *
     * It accepts the following units:
     * - `px` or unit-less, interpreted as pixels
     * - `%` or `%r`, percentage relative to the length of the reference element
     * - `%p`, percentage relative to the length of the popper element
     * - `vw`, CSS viewport width unit
     * - `vh`, CSS viewport height unit
     *
     * For length is intended the main axis relative to the placement of the popper.<br />
     * This means that if the placement is `top` or `bottom`, the length will be the
     * `width`. In case of `left` or `right`, it will be the `height`.
     *
     * You can provide a single value (as `Number` or `String`), or a pair of values
     * as `String` divided by a comma or one (or more) white spaces.<br />
     * The latter is a deprecated method because it leads to confusion and will be
     * removed in v2.<br />
     * Additionally, it accepts additions and subtractions between different units.
     * Note that multiplications and divisions aren't supported.
     *
     * Valid examples are:
     * ```
     * 10
     * '10%'
     * '10, 10'
     * '10%, 10'
     * '10 + 10%'
     * '10 - 5vh + 3%'
     * '-10px + 5vh, 5px - 6%'
     * ```
     * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
     * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
     * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
     *
     * @memberof modifiers
     * @inner
     */
    offset: {
      /** @prop {number} order=200 - Index used to define the order of execution */
      order: 200,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: offset$1,
      /** @prop {Number|String} offset=0
       * The offset value as described in the modifier description
       */
      offset: 0,
    },

    /**
     * Modifier used to prevent the popper from being positioned outside the boundary.
     *
     * A scenario exists where the reference itself is not within the boundaries.<br />
     * We can say it has "escaped the boundaries" — or just "escaped".<br />
     * In this case we need to decide whether the popper should either:
     *
     * - detach from the reference and remain "trapped" in the boundaries, or
     * - if it should ignore the boundary and "escape with its reference"
     *
     * When `escapeWithReference` is set to`true` and reference is completely
     * outside its boundaries, the popper will overflow (or completely leave)
     * the boundaries in order to remain attached to the edge of the reference.
     *
     * @memberof modifiers
     * @inner
     */
    preventOverflow: {
      /** @prop {number} order=300 - Index used to define the order of execution */
      order: 300,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: preventOverflow$1,
      /**
       * @prop {Array} [priority=['left','right','top','bottom']]
       * Popper will try to prevent overflow following these priorities by default,
       * then, it could overflow on the left and on top of the `boundariesElement`
       */
      priority: ['left', 'right', 'top', 'bottom'],
      /**
       * @prop {number} padding=5
       * Amount of pixel used to define a minimum distance between the boundaries
       * and the popper. This makes sure the popper always has a little padding
       * between the edges of its container
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='scrollParent'
       * Boundaries used by the modifier. Can be `scrollParent`, `window`,
       * `viewport` or any DOM element.
       */
      boundariesElement: 'scrollParent',
    },

    /**
     * Modifier used to make sure the reference and its popper stay near each other
     * without leaving any gap between the two. Especially useful when the arrow is
     * enabled and you want to ensure that it points to its reference element.
     * It cares only about the first axis. You can still have poppers with margin
     * between the popper and its reference element.
     * @memberof modifiers
     * @inner
     */
    keepTogether: {
      /** @prop {number} order=400 - Index used to define the order of execution */
      order: 400,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: keepTogether$1,
    },

    /**
     * This modifier is used to move the `arrowElement` of the popper to make
     * sure it is positioned between the reference element and its popper element.
     * It will read the outer size of the `arrowElement` node to detect how many
     * pixels of conjunction are needed.
     *
     * It has no effect if no `arrowElement` is provided.
     * @memberof modifiers
     * @inner
     */
    arrow: {
      /** @prop {number} order=500 - Index used to define the order of execution */
      order: 500,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: arrow$1,
      /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
      element: '[x-arrow]',
    },

    /**
     * Modifier used to flip the popper's placement when it starts to overlap its
     * reference element.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     *
     * **NOTE:** this modifier will interrupt the current update cycle and will
     * restart it if it detects the need to flip the placement.
     * @memberof modifiers
     * @inner
     */
    flip: {
      /** @prop {number} order=600 - Index used to define the order of execution */
      order: 600,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: flip$1,
      /**
       * @prop {String|Array} behavior='flip'
       * The behavior used to change the popper's placement. It can be one of
       * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
       * placements (with optional variations)
       */
      behavior: 'flip',
      /**
       * @prop {number} padding=5
       * The popper will flip if it hits the edges of the `boundariesElement`
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='viewport'
       * The element which will define the boundaries of the popper position.
       * The popper will never be placed outside of the defined boundaries
       * (except if `keepTogether` is enabled)
       */
      boundariesElement: 'viewport',
      /**
       * @prop {Boolean} flipVariations=false
       * The popper will switch placement variation between `-start` and `-end` when
       * the reference element overlaps its boundaries.
       *
       * The original placement should have a set variation.
       */
      flipVariations: false,
      /**
       * @prop {Boolean} flipVariationsByContent=false
       * The popper will switch placement variation between `-start` and `-end` when
       * the popper element overlaps its reference boundaries.
       *
       * The original placement should have a set variation.
       */
      flipVariationsByContent: false,
    },

    /**
     * Modifier used to make the popper flow toward the inner of the reference element.
     * By default, when this modifier is disabled, the popper will be placed outside
     * the reference element.
     * @memberof modifiers
     * @inner
     */
    inner: {
      /** @prop {number} order=700 - Index used to define the order of execution */
      order: 700,
      /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
      enabled: false,
      /** @prop {ModifierFn} */
      fn: inner$1,
    },

    /**
     * Modifier used to hide the popper when its reference element is outside of the
     * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
     * be used to hide with a CSS selector the popper when its reference is
     * out of boundaries.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     * @memberof modifiers
     * @inner
     */
    hide: {
      /** @prop {number} order=800 - Index used to define the order of execution */
      order: 800,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: hide$1,
    },

    /**
     * Computes the style that will be applied to the popper element to gets
     * properly positioned.
     *
     * Note that this modifier will not touch the DOM, it just prepares the styles
     * so that `applyStyle` modifier can apply it. This separation is useful
     * in case you need to replace `applyStyle` with a custom implementation.
     *
     * This modifier has `850` as `order` value to maintain backward compatibility
     * with previous versions of Popper.js. Expect the modifiers ordering method
     * to change in future major versions of the library.
     *
     * @memberof modifiers
     * @inner
     */
    computeStyle: {
      /** @prop {number} order=850 - Index used to define the order of execution */
      order: 850,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: computeStyle$1,
      /**
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: true,
      /**
       * @prop {string} [x='bottom']
       * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
       * Change this if your popper should grow in a direction different from `bottom`
       */
      x: 'bottom',
      /**
       * @prop {string} [x='left']
       * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
       * Change this if your popper should grow in a direction different from `right`
       */
      y: 'right',
    },

    /**
     * Applies the computed styles to the popper element.
     *
     * All the DOM manipulations are limited to this modifier. This is useful in case
     * you want to integrate Popper.js inside a framework or view library and you
     * want to delegate all the DOM manipulations to it.
     *
     * Note that if you disable this modifier, you must make sure the popper element
     * has its position set to `absolute` before Popper.js can do its work!
     *
     * Just disable this modifier and define your own to achieve the desired effect.
     *
     * @memberof modifiers
     * @inner
     */
    applyStyle: {
      /** @prop {number} order=900 - Index used to define the order of execution */
      order: 900,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: applyStyle$1,
      /** @prop {Function} */
      onLoad: applyStyleOnLoad$1,
      /**
       * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: undefined,
    },
  };

  /**
   * The `dataObject` is an object containing all the information used by Popper.js.
   * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
   * @name dataObject
   * @property {Object} data.instance The Popper.js instance
   * @property {String} data.placement Placement applied to popper
   * @property {String} data.originalPlacement Placement originally defined on init
   * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
   * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
   * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
   * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.boundaries Offsets of the popper boundaries
   * @property {Object} data.offsets The measurements of popper, reference and arrow elements
   * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
   */

  /**
   * Default options provided to Popper.js constructor.<br />
   * These can be overridden using the `options` argument of Popper.js.<br />
   * To override an option, simply pass an object with the same
   * structure of the `options` object, as the 3rd argument. For example:
   * ```
   * new Popper(ref, pop, {
   *   modifiers: {
   *     preventOverflow: { enabled: false }
   *   }
   * })
   * ```
   * @type {Object}
   * @static
   * @memberof Popper
   */
  var Defaults$1 = {
    /**
     * Popper's placement.
     * @prop {Popper.placements} placement='bottom'
     */
    placement: 'bottom',

    /**
     * Set this to true if you want popper to position it self in 'fixed' mode
     * @prop {Boolean} positionFixed=false
     */
    positionFixed: false,

    /**
     * Whether events (resize, scroll) are initially enabled.
     * @prop {Boolean} eventsEnabled=true
     */
    eventsEnabled: true,

    /**
     * Set to true if you want to automatically remove the popper when
     * you call the `destroy` method.
     * @prop {Boolean} removeOnDestroy=false
     */
    removeOnDestroy: false,

    /**
     * Callback called when the popper is created.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onCreate}
     */
    onCreate: () => {},

    /**
     * Callback called when the popper is updated. This callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onUpdate}
     */
    onUpdate: () => {},

    /**
     * List of modifiers used to modify the offsets before they are applied to the popper.
     * They provide most of the functionalities of Popper.js.
     * @prop {modifiers}
     */
    modifiers: modifiers$1,
  };

  /**
   * @callback onCreate
   * @param {dataObject} data
   */

  /**
   * @callback onUpdate
   * @param {dataObject} data
   */

  // Utils

  class Popper$2 {
    /**
     * Creates a new Popper.js instance.
     * @class Popper
     * @param {Element|referenceObject} reference - The reference element used to position the popper
     * @param {Element} popper - The HTML / XML element used as the popper
     * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
     * @return {Object} instance - The generated Popper.js instance
     */
    constructor(reference, popper, options = {}) {
      // make update() debounced, so that it only runs at most once-per-tick
      this.update = debounce$1(this.update.bind(this));

      // with {} we create a new object with the options inside it
      this.options = { ...Popper$2.Defaults, ...options };

      // init state
      this.state = {
        isDestroyed: false,
        isCreated: false,
        scrollParents: [],
      };

      // get reference and popper elements (allow jQuery wrappers)
      this.reference = reference && reference.jquery ? reference[0] : reference;
      this.popper = popper && popper.jquery ? popper[0] : popper;

      // Deep merge modifiers options
      this.options.modifiers = {};
      Object.keys({
        ...Popper$2.Defaults.modifiers,
        ...options.modifiers,
      }).forEach(name => {
        this.options.modifiers[name] = {
          // If it's a built-in modifier, use it as base
          ...(Popper$2.Defaults.modifiers[name] || {}),
          // If there are custom options, override and merge with default ones
          ...(options.modifiers ? options.modifiers[name] : {}),
        };
      });

      // Refactoring modifiers' list (Object => Array)
      this.modifiers = Object.keys(this.options.modifiers)
        .map(name => ({
          name,
          ...this.options.modifiers[name],
        }))
        // sort the modifiers by order
        .sort((a, b) => a.order - b.order);

      // modifiers have the ability to execute arbitrary code when Popper.js get inited
      // such code is executed in the same order of its modifier
      // they could add new properties to their options configuration
      // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
      this.modifiers.forEach(modifierOptions => {
        if (modifierOptions.enabled && isFunction$1(modifierOptions.onLoad)) {
          modifierOptions.onLoad(
            this.reference,
            this.popper,
            this.options,
            modifierOptions,
            this.state
          );
        }
      });

      // fire the first update to position the popper in the right place
      this.update();

      const eventsEnabled = this.options.eventsEnabled;
      if (eventsEnabled) {
        // setup event listeners, they will take care of update the position in specific situations
        this.enableEventListeners();
      }

      this.state.eventsEnabled = eventsEnabled;
    }

    // We can't use class properties because they don't get listed in the
    // class prototype and break stuff like Sinon stubs
    update() {
      return update$1.call(this);
    }
    destroy() {
      return destroy$1.call(this);
    }
    enableEventListeners() {
      return enableEventListeners$1.call(this);
    }
    disableEventListeners() {
      return disableEventListeners$1.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */
    scheduleUpdate = () => requestAnimationFrame(this.update);

    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */
    static Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;

    static placements = placements$1;

    static Defaults = Defaults$1;
  }

  /**
   * The `referenceObject` is an object that provides an interface compatible with Popper.js
   * and lets you use it as replacement of a real DOM node.<br />
   * You can use this method to position a popper relatively to a set of coordinates
   * in case you don't have a DOM node to use as reference.
   *
   * ```
   * new Popper(referenceObject, popperNode);
   * ```
   *
   * NB: This feature isn't supported in Internet Explorer 10.
   * @name referenceObject
   * @property {Function} data.getBoundingClientRect
   * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
   * @property {number} data.clientWidth
   * An ES6 getter that will return the width of the virtual reference element.
   * @property {number} data.clientHeight
   * An ES6 getter that will return the height of the virtual reference element.
   */

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  const TRANSITION_END = 'transitionend';
  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;

  // Shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    if (obj === null || typeof obj === 'undefined') {
      return `${obj}`
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase()
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle(event) {
        if ($__default['default'](event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments) // eslint-disable-line prefer-rest-params
        }

        return undefined
      }
    }
  }

  function transitionEndEmulator(duration) {
    let called = false;

    $__default['default'](this).one(Util.TRANSITION_END, () => {
      called = true;
    });

    setTimeout(() => {
      if (!called) {
        Util.triggerTransitionEnd(this);
      }
    }, duration);

    return this
  }

  function setTransitionEndSupport() {
    $__default['default'].fn.emulateTransitionEnd = transitionEndEmulator;
    $__default['default'].event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }

  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  const Util = {
    TRANSITION_END: 'bsTransitionEnd',

    getUID(prefix) {
      do {
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix))

      return prefix
    },

    getSelectorFromElement(element) {
      let selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        const hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null
      } catch (_) {
        return null
      }
    },

    getTransitionDurationFromElement(element) {
      if (!element) {
        return 0
      }

      // Get transition-duration of the element
      let transitionDuration = $__default['default'](element).css('transition-duration');
      let transitionDelay = $__default['default'](element).css('transition-delay');

      const floatTransitionDuration = parseFloat(transitionDuration);
      const floatTransitionDelay = parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];

      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
    },

    reflow(element) {
      return element.offsetHeight
    },

    triggerTransitionEnd(element) {
      $__default['default'](element).trigger(TRANSITION_END);
    },

    supportsTransitionEnd() {
      return Boolean(TRANSITION_END)
    },

    isElement(obj) {
      return (obj[0] || obj).nodeType
    },

    typeCheckConfig(componentName, config, configTypes) {
      for (const property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          const expectedTypes = configTypes[property];
          const value = config[property];
          const valueType = value && Util.isElement(value) ?
            'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(
              `${componentName.toUpperCase()}: ` +
              `Option "${property}" provided type "${valueType}" ` +
              `but expected type "${expectedTypes}".`)
          }
        }
      }
    },

    findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null
      }

      // Can find the shadow root otherwise it'll return the document
      if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null
      }

      if (element instanceof ShadowRoot) {
        return element
      }

      // when we don't find a shadow root
      if (!element.parentNode) {
        return null
      }

      return Util.findShadowRoot(element.parentNode)
    },

    jQueryDetection() {
      if (typeof $__default['default'] === 'undefined') {
        throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.')
      }

      const version = $__default['default'].fn.jquery.split(' ')[0].split('.');
      const minMajor = 1;
      const ltMajor = 2;
      const minMinor = 9;
      const minPatch = 1;
      const maxMajor = 4;

      if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
        throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0')
      }
    }
  };

  Util.jQueryDetection();
  setTransitionEndSupport();

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'alert';
  const VERSION$a = '4.6.0';
  const DATA_KEY$a = 'bs.alert';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$7 = '.data-api';
  const JQUERY_NO_CONFLICT$a = $__default['default'].fn[NAME$a];

  const SELECTOR_DISMISS = '[data-dismiss="alert"]';

  const EVENT_CLOSE = `close${EVENT_KEY$a}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$a}`;
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$7}`;

  const CLASS_NAME_ALERT = 'alert';
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$7 = 'show';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert {
    constructor(element) {
      this._element = element;
    }

    // Getters

    static get VERSION() {
      return VERSION$a
    }

    // Public

    close(element) {
      let rootElement = this._element;
      if (element) {
        rootElement = this._getRootElement(element);
      }

      const customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return
      }

      this._removeElement(rootElement);
    }

    dispose() {
      $__default['default'].removeData(this._element, DATA_KEY$a);
      this._element = null;
    }

    // Private

    _getRootElement(element) {
      const selector = Util.getSelectorFromElement(element);
      let parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $__default['default'](element).closest(`.${CLASS_NAME_ALERT}`)[0];
      }

      return parent
    }

    _triggerCloseEvent(element) {
      const closeEvent = $__default['default'].Event(EVENT_CLOSE);

      $__default['default'](element).trigger(closeEvent);
      return closeEvent
    }

    _removeElement(element) {
      $__default['default'](element).removeClass(CLASS_NAME_SHOW$7);

      if (!$__default['default'](element).hasClass(CLASS_NAME_FADE$5)) {
        this._destroyElement(element);
        return
      }

      const transitionDuration = Util.getTransitionDurationFromElement(element);

      $__default['default'](element)
        .one(Util.TRANSITION_END, event => this._destroyElement(element, event))
        .emulateTransitionEnd(transitionDuration);
    }

    _destroyElement(element) {
      $__default['default'](element)
        .detach()
        .trigger(EVENT_CLOSED)
        .remove();
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $__default['default'](this);
        let data = $element.data(DATA_KEY$a);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY$a, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      })
    }

    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      }
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](document).on(
    EVENT_CLICK_DATA_API$6,
    SELECTOR_DISMISS,
    Alert._handleDismiss(new Alert())
  );

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$a] = Alert._jQueryInterface;
  $__default['default'].fn[NAME$a].Constructor = Alert;
  $__default['default'].fn[NAME$a].noConflict = () => {
    $__default['default'].fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Alert._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$9 = 'button';
  const VERSION$9 = '4.6.0';
  const DATA_KEY$9 = 'bs.button';
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = '.data-api';
  const JQUERY_NO_CONFLICT$9 = $__default['default'].fn[NAME$9];

  const CLASS_NAME_ACTIVE$3 = 'active';
  const CLASS_NAME_BUTTON = 'btn';
  const CLASS_NAME_FOCUS = 'focus';

  const SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]';
  const SELECTOR_DATA_TOGGLES = '[data-toggle="buttons"]';
  const SELECTOR_DATA_TOGGLE$4 = '[data-toggle="button"]';
  const SELECTOR_DATA_TOGGLES_BUTTONS = '[data-toggle="buttons"] .btn';
  const SELECTOR_INPUT = 'input:not([type="hidden"])';
  const SELECTOR_ACTIVE$2 = '.active';
  const SELECTOR_BUTTON = '.btn';

  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const EVENT_FOCUS_BLUR_DATA_API = `focus${EVENT_KEY$9}${DATA_API_KEY$6} ` +
                            `blur${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$9}${DATA_API_KEY$6}`;

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button {
    constructor(element) {
      this._element = element;
      this.shouldAvoidTriggerChange = false;
    }

    // Getters

    static get VERSION() {
      return VERSION$9
    }

    // Public

    toggle() {
      let triggerChangeEvent = true;
      let addAriaPressed = true;
      const rootElement = $__default['default'](this._element).closest(SELECTOR_DATA_TOGGLES)[0];

      if (rootElement) {
        const input = this._element.querySelector(SELECTOR_INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE$3)) {
              triggerChangeEvent = false;
            } else {
              const activeElement = rootElement.querySelector(SELECTOR_ACTIVE$2);

              if (activeElement) {
                $__default['default'](activeElement).removeClass(CLASS_NAME_ACTIVE$3);
              }
            }
          }

          if (triggerChangeEvent) {
            // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE$3);
            }

            if (!this.shouldAvoidTriggerChange) {
              $__default['default'](input).trigger('change');
            }
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
        if (addAriaPressed) {
          this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE$3));
        }

        if (triggerChangeEvent) {
          $__default['default'](this._element).toggleClass(CLASS_NAME_ACTIVE$3);
        }
      }
    }

    dispose() {
      $__default['default'].removeData(this._element, DATA_KEY$9);
      this._element = null;
    }

    // Static

    static _jQueryInterface(config, avoidTriggerChange) {
      return this.each(function () {
        const $element = $__default['default'](this);
        let data = $element.data(DATA_KEY$9);

        if (!data) {
          data = new Button(this);
          $element.data(DATA_KEY$9, data);
        }

        data.shouldAvoidTriggerChange = avoidTriggerChange;

        if (config === 'toggle') {
          data[config]();
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](document)
    .on(EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE_CARROT, event => {
      let button = event.target;
      const initialButton = button;

      if (!$__default['default'](button).hasClass(CLASS_NAME_BUTTON)) {
        button = $__default['default'](button).closest(SELECTOR_BUTTON)[0];
      }

      if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {
        event.preventDefault(); // work around Firefox bug #1540995
      } else {
        const inputBtn = button.querySelector(SELECTOR_INPUT);

        if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {
          event.preventDefault(); // work around Firefox bug #1540995
          return
        }

        if (initialButton.tagName === 'INPUT' || button.tagName !== 'LABEL') {
          Button._jQueryInterface.call($__default['default'](button), 'toggle', initialButton.tagName === 'INPUT');
        }
      }
    })
    .on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
      const button = $__default['default'](event.target).closest(SELECTOR_BUTTON)[0];
      $__default['default'](button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type));
    });

  $__default['default'](window).on(EVENT_LOAD_DATA_API$2, () => {
    // ensure correct active class is set to match the controls' actual values/states

    // find all checkboxes/readio buttons inside data-toggle groups
    let buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLES_BUTTONS));
    for (let i = 0, len = buttons.length; i < len; i++) {
      const button = buttons[i];
      const input = button.querySelector(SELECTOR_INPUT);
      if (input.checked || input.hasAttribute('checked')) {
        button.classList.add(CLASS_NAME_ACTIVE$3);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE$3);
      }
    }

    // find all button toggles
    buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$4));
    for (let i = 0, len = buttons.length; i < len; i++) {
      const button = buttons[i];
      if (button.getAttribute('aria-pressed') === 'true') {
        button.classList.add(CLASS_NAME_ACTIVE$3);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE$3);
      }
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$9] = Button._jQueryInterface;
  $__default['default'].fn[NAME$9].Constructor = Button;
  $__default['default'].fn[NAME$9].noConflict = () => {
    $__default['default'].fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return Button._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$8 = 'carousel';
  const VERSION$8 = '4.6.0';
  const DATA_KEY$8 = 'bs.carousel';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = '.data-api';
  const JQUERY_NO_CONFLICT$8 = $__default['default'].fn[NAME$8];
  const ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key
  const ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch
  const SWIPE_THRESHOLD = 40;

  const Default$7 = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };

  const DefaultType$7 = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };

  const DIRECTION_NEXT = 'next';
  const DIRECTION_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';

  const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
  const EVENT_SLID = `slid${EVENT_KEY$8}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$8}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$8}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$8}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$8}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$8}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$8}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$8}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$8}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;

  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_RIGHT = 'carousel-item-right';
  const CLASS_NAME_LEFT = 'carousel-item-left';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';

  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_DATA_SLIDE = '[data-slide], [data-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-ride="carousel"]';

  const PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */
  class Carousel {
    constructor(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;

      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = this._element.querySelector(SELECTOR_INDICATORS);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

      this._addEventListeners();
    }

    // Getters

    static get VERSION() {
      return VERSION$8
    }

    static get Default() {
      return Default$7
    }

    // Public

    next() {
      if (!this._isSliding) {
        this._slide(DIRECTION_NEXT);
      }
    }

    nextWhenVisible() {
      const $element = $__default['default'](this._element);
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden &&
        ($element.is(':visible') && $element.css('visibility') !== 'hidden')) {
        this.next();
      }
    }

    prev() {
      if (!this._isSliding) {
        this._slide(DIRECTION_PREV);
      }
    }

    pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (this._element.querySelector(SELECTOR_NEXT_PREV)) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval(
          (document.visibilityState ? this.nextWhenVisible : this.next).bind(this),
          this._config.interval
        );
      }
    }

    to(index) {
      this._activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM);

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return
      }

      if (this._isSliding) {
        $__default['default'](this._element).one(EVENT_SLID, () => this.to(index));
        return
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return
      }

      const direction = index > activeIndex ?
        DIRECTION_NEXT :
        DIRECTION_PREV;

      this._slide(direction, this._items[index]);
    }

    dispose() {
      $__default['default'](this._element).off(EVENT_KEY$8);
      $__default['default'].removeData(this._element, DATA_KEY$8);

      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default$7,
        ...config
      };
      Util.typeCheckConfig(NAME$8, config, DefaultType$7);
      return config
    }

    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return
      }

      const direction = absDeltax / this.touchDeltaX;

      this.touchDeltaX = 0;

      // swipe left
      if (direction > 0) {
        this.prev();
      }

      // swipe right
      if (direction < 0) {
        this.next();
      }
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        $__default['default'](this._element).on(EVENT_KEYDOWN, event => this._keydown(event));
      }

      if (this._config.pause === 'hover') {
        $__default['default'](this._element)
          .on(EVENT_MOUSEENTER, event => this.pause(event))
          .on(EVENT_MOUSELEAVE, event => this.cycle(event));
      }

      if (this._config.touch) {
        this._addTouchEventListeners();
      }
    }

    _addTouchEventListeners() {
      if (!this._touchSupported) {
        return
      }

      const start = event => {
        if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          this.touchStartX = event.originalEvent.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };

      const move = event => {
        // ensure swiping with one touch and not pinching
        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
          this.touchDeltaX = 0;
        } else {
          this.touchDeltaX = event.originalEvent.touches[0].clientX - this.touchStartX;
        }
      };

      const end = event => {
        if (this._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          this.touchDeltaX = event.originalEvent.clientX - this.touchStartX;
        }

        this._handleSwipe();
        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling

          this.pause();
          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }

          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        }
      };

      $__default['default'](this._element.querySelectorAll(SELECTOR_ITEM_IMG))
        .on(EVENT_DRAG_START, e => e.preventDefault());

      if (this._pointerEvent) {
        $__default['default'](this._element).on(EVENT_POINTERDOWN, event => start(event));
        $__default['default'](this._element).on(EVENT_POINTERUP, event => end(event));

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        $__default['default'](this._element).on(EVENT_TOUCHSTART, event => start(event));
        $__default['default'](this._element).on(EVENT_TOUCHMOVE, event => move(event));
        $__default['default'](this._element).on(EVENT_TOUCHEND, event => end(event));
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break
        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break
      }
    }

    _getItemIndex(element) {
      this._items = element && element.parentNode ?
        [].slice.call(element.parentNode.querySelectorAll(SELECTOR_ITEM)) :
        [];
      return this._items.indexOf(element)
    }

    _getItemByDirection(direction, activeElement) {
      const isNextDirection = direction === DIRECTION_NEXT;
      const isPrevDirection = direction === DIRECTION_PREV;
      const activeIndex = this._getItemIndex(activeElement);
      const lastItemIndex = this._items.length - 1;
      const isGoingToWrap = isPrevDirection && activeIndex === 0 ||
                              isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement
      }

      const delta = direction === DIRECTION_PREV ? -1 : 1;
      const itemIndex = (activeIndex + delta) % this._items.length;

      return itemIndex === -1 ?
        this._items[this._items.length - 1] : this._items[itemIndex]
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);
      const fromIndex = this._getItemIndex(this._element.querySelector(SELECTOR_ACTIVE_ITEM));
      const slideEvent = $__default['default'].Event(EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });

      $__default['default'](this._element).trigger(slideEvent);

      return slideEvent
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const indicators = [].slice.call(this._indicatorsElement.querySelectorAll(SELECTOR_ACTIVE$1));
        $__default['default'](indicators).removeClass(CLASS_NAME_ACTIVE$2);

        const nextIndicator = this._indicatorsElement.children[
          this._getItemIndex(element)
        ];

        if (nextIndicator) {
          $__default['default'](nextIndicator).addClass(CLASS_NAME_ACTIVE$2);
        }
      }
    }

    _updateInterval() {
      const element = this._activeElement || this._element.querySelector(SELECTOR_ACTIVE_ITEM);

      if (!element) {
        return
      }

      const elementInterval = parseInt(element.getAttribute('data-interval'), 10);

      if (elementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = elementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }
    }

    _slide(direction, element) {
      const activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM);
      const activeElementIndex = this._getItemIndex(activeElement);
      const nextElement = element || activeElement &&
        this._getItemByDirection(direction, activeElement);
      const nextElementIndex = this._getItemIndex(nextElement);
      const isCycling = Boolean(this._interval);

      let directionalClassName;
      let orderClassName;
      let eventDirectionName;

      if (direction === DIRECTION_NEXT) {
        directionalClassName = CLASS_NAME_LEFT;
        orderClassName = CLASS_NAME_NEXT;
        eventDirectionName = DIRECTION_LEFT;
      } else {
        directionalClassName = CLASS_NAME_RIGHT;
        orderClassName = CLASS_NAME_PREV;
        eventDirectionName = DIRECTION_RIGHT;
      }

      if (nextElement && $__default['default'](nextElement).hasClass(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);
      if (slideEvent.isDefaultPrevented()) {
        return
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);
      this._activeElement = nextElement;

      const slidEvent = $__default['default'].Event(EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($__default['default'](this._element).hasClass(CLASS_NAME_SLIDE)) {
        $__default['default'](nextElement).addClass(orderClassName);

        Util.reflow(nextElement);

        $__default['default'](activeElement).addClass(directionalClassName);
        $__default['default'](nextElement).addClass(directionalClassName);

        const transitionDuration = Util.getTransitionDurationFromElement(activeElement);

        $__default['default'](activeElement)
          .one(Util.TRANSITION_END, () => {
            $__default['default'](nextElement)
              .removeClass(`${directionalClassName} ${orderClassName}`)
              .addClass(CLASS_NAME_ACTIVE$2);

            $__default['default'](activeElement).removeClass(`${CLASS_NAME_ACTIVE$2} ${orderClassName} ${directionalClassName}`);

            this._isSliding = false;

            setTimeout(() => $__default['default'](this._element).trigger(slidEvent), 0);
          })
          .emulateTransitionEnd(transitionDuration);
      } else {
        $__default['default'](activeElement).removeClass(CLASS_NAME_ACTIVE$2);
        $__default['default'](nextElement).addClass(CLASS_NAME_ACTIVE$2);

        this._isSliding = false;
        $__default['default'](this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $__default['default'](this).data(DATA_KEY$8);
        let _config = {
          ...Default$7,
          ...$__default['default'](this).data()
        };

        if (typeof config === 'object') {
          _config = {
            ..._config,
            ...config
          };
        }

        const action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $__default['default'](this).data(DATA_KEY$8, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError(`No method named "${action}"`)
          }

          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      })
    }

    static _dataApiClickHandler(event) {
      const selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return
      }

      const target = $__default['default'](selector)[0];

      if (!target || !$__default['default'](target).hasClass(CLASS_NAME_CAROUSEL)) {
        return
      }

      const config = {
        ...$__default['default'](target).data(),
        ...$__default['default'](this).data()
      };
      const slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($__default['default'](target), config);

      if (slideIndex) {
        $__default['default'](target).data(DATA_KEY$8).to(slideIndex);
      }

      event.preventDefault();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](document).on(EVENT_CLICK_DATA_API$4, SELECTOR_DATA_SLIDE, Carousel._dataApiClickHandler);

  $__default['default'](window).on(EVENT_LOAD_DATA_API$1, () => {
    const carousels = [].slice.call(document.querySelectorAll(SELECTOR_DATA_RIDE));
    for (let i = 0, len = carousels.length; i < len; i++) {
      const $carousel = $__default['default'](carousels[i]);
      Carousel._jQueryInterface.call($carousel, $carousel.data());
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$8] = Carousel._jQueryInterface;
  $__default['default'].fn[NAME$8].Constructor = Carousel;
  $__default['default'].fn[NAME$8].noConflict = () => {
    $__default['default'].fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return Carousel._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$7 = 'collapse';
  const VERSION$7 = '4.6.0';
  const DATA_KEY$7 = 'bs.collapse';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = '.data-api';
  const JQUERY_NO_CONFLICT$7 = $__default['default'].fn[NAME$7];

  const Default$6 = {
    toggle: true,
    parent: ''
  };

  const DefaultType$6 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };

  const EVENT_SHOW$4 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$7}`;
  const EVENT_HIDE$4 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;

  const CLASS_NAME_SHOW$6 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';

  const DIMENSION_WIDTH = 'width';
  const DIMENSION_HEIGHT = 'height';

  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$3 = '[data-toggle="collapse"]';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse {
    constructor(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll(
        `[data-toggle="collapse"][href="#${element.id}"],` +
        `[data-toggle="collapse"][data-target="#${element.id}"]`
      ));

      const toggleList = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$3));
      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = Util.getSelectorFromElement(elem);
        const filterElement = [].slice.call(document.querySelectorAll(selector))
          .filter(foundElem => foundElem === element);

        if (selector !== null && filterElement.length > 0) {
          this._selector = selector;
          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    }

    // Getters

    static get VERSION() {
      return VERSION$7
    }

    static get Default() {
      return Default$6
    }

    // Public

    toggle() {
      if ($__default['default'](this._element).hasClass(CLASS_NAME_SHOW$6)) {
        this.hide();
      } else {
        this.show();
      }
    }

    show() {
      if (this._isTransitioning ||
        $__default['default'](this._element).hasClass(CLASS_NAME_SHOW$6)) {
        return
      }

      let actives;
      let activesData;

      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(SELECTOR_ACTIVES))
          .filter(elem => {
            if (typeof this._config.parent === 'string') {
              return elem.getAttribute('data-parent') === this._config.parent
            }

            return elem.classList.contains(CLASS_NAME_COLLAPSE)
          });

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $__default['default'](actives).not(this._selector).data(DATA_KEY$7);
        if (activesData && activesData._isTransitioning) {
          return
        }
      }

      const startEvent = $__default['default'].Event(EVENT_SHOW$4);
      $__default['default'](this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return
      }

      if (actives) {
        Collapse._jQueryInterface.call($__default['default'](actives).not(this._selector), 'hide');
        if (!activesData) {
          $__default['default'](actives).data(DATA_KEY$7, null);
        }
      }

      const dimension = this._getDimension();

      $__default['default'](this._element)
        .removeClass(CLASS_NAME_COLLAPSE)
        .addClass(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $__default['default'](this._triggerArray)
          .removeClass(CLASS_NAME_COLLAPSED)
          .attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      const complete = () => {
        $__default['default'](this._element)
          .removeClass(CLASS_NAME_COLLAPSING)
          .addClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW$6}`);

        this._element.style[dimension] = '';

        this.setTransitioning(false);

        $__default['default'](this._element).trigger(EVENT_SHOWN$4);
      };

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;
      const transitionDuration = Util.getTransitionDurationFromElement(this._element);

      $__default['default'](this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration);

      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }

    hide() {
      if (this._isTransitioning ||
        !$__default['default'](this._element).hasClass(CLASS_NAME_SHOW$6)) {
        return
      }

      const startEvent = $__default['default'].Event(EVENT_HIDE$4);
      $__default['default'](this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return
      }

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;

      Util.reflow(this._element);

      $__default['default'](this._element)
        .addClass(CLASS_NAME_COLLAPSING)
        .removeClass(`${CLASS_NAME_COLLAPSE} ${CLASS_NAME_SHOW$6}`);

      const triggerArrayLength = this._triggerArray.length;
      if (triggerArrayLength > 0) {
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            const $elem = $__default['default']([].slice.call(document.querySelectorAll(selector)));
            if (!$elem.hasClass(CLASS_NAME_SHOW$6)) {
              $__default['default'](trigger).addClass(CLASS_NAME_COLLAPSED)
                .attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      const complete = () => {
        this.setTransitioning(false);
        $__default['default'](this._element)
          .removeClass(CLASS_NAME_COLLAPSING)
          .addClass(CLASS_NAME_COLLAPSE)
          .trigger(EVENT_HIDDEN$4);
      };

      this._element.style[dimension] = '';
      const transitionDuration = Util.getTransitionDurationFromElement(this._element);

      $__default['default'](this._element)
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(transitionDuration);
    }

    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    }

    dispose() {
      $__default['default'].removeData(this._element, DATA_KEY$7);

      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default$6,
        ...config
      };
      config.toggle = Boolean(config.toggle); // Coerce string values
      Util.typeCheckConfig(NAME$7, config, DefaultType$6);
      return config
    }

    _getDimension() {
      const hasWidth = $__default['default'](this._element).hasClass(DIMENSION_WIDTH);
      return hasWidth ? DIMENSION_WIDTH : DIMENSION_HEIGHT
    }

    _getParent() {
      let parent;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent;

        // It's a jQuery object
        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }

      const selector = `[data-toggle="collapse"][data-parent="${this._config.parent}"]`;
      const children = [].slice.call(parent.querySelectorAll(selector));

      $__default['default'](children).each((i, element) => {
        this._addAriaAndCollapsedClass(
          Collapse._getTargetFromElement(element),
          [element]
        );
      });

      return parent
    }

    _addAriaAndCollapsedClass(element, triggerArray) {
      const isOpen = $__default['default'](element).hasClass(CLASS_NAME_SHOW$6);

      if (triggerArray.length) {
        $__default['default'](triggerArray)
          .toggleClass(CLASS_NAME_COLLAPSED, !isOpen)
          .attr('aria-expanded', isOpen);
      }
    }

    // Static

    static _getTargetFromElement(element) {
      const selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null
    }

    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $__default['default'](this);
        let data = $element.data(DATA_KEY$7);
        const _config = {
          ...Default$6,
          ...$element.data(),
          ...(typeof config === 'object' && config ? config : {})
        };

        if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $element.data(DATA_KEY$7, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config]();
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](document).on(EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    const $trigger = $__default['default'](this);
    const selector = Util.getSelectorFromElement(this);
    const selectors = [].slice.call(document.querySelectorAll(selector));

    $__default['default'](selectors).each(function () {
      const $target = $__default['default'](this);
      const data = $target.data(DATA_KEY$7);
      const config = data ? 'toggle' : $trigger.data();
      Collapse._jQueryInterface.call($target, config);
    });
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$7] = Collapse._jQueryInterface;
  $__default['default'].fn[NAME$7].Constructor = Collapse;
  $__default['default'].fn[NAME$7].noConflict = () => {
    $__default['default'].fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return Collapse._jQueryInterface
  };

  /**!
   * @fileOverview Kickass library to create and place poppers near their reference elements.
   * @version 1.16.1
   * @license
   * Copyright (c) 2016 Federico Zivolo and contributors
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
  var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

  var timeoutDuration = function () {
    var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
    for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
      if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
        return 1;
      }
    }
    return 0;
  }();

  function microtaskDebounce(fn) {
    var called = false;
    return function () {
      if (called) {
        return;
      }
      called = true;
      window.Promise.resolve().then(function () {
        called = false;
        fn();
      });
    };
  }

  function taskDebounce(fn) {
    var scheduled = false;
    return function () {
      if (!scheduled) {
        scheduled = true;
        setTimeout(function () {
          scheduled = false;
          fn();
        }, timeoutDuration);
      }
    };
  }

  var supportsMicroTasks = isBrowser && window.Promise;

  /**
  * Create a debounced version of a method, that's asynchronously deferred
  * but called in the minimum time possible.
  *
  * @method
  * @memberof Popper.Utils
  * @argument {Function} fn
  * @returns {Function}
  */
  var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

  /**
   * Check if the given variable is a function
   * @method
   * @memberof Popper.Utils
   * @argument {Any} functionToCheck - variable to check
   * @returns {Boolean} answer to: is a function?
   */
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  }

  /**
   * Get CSS computed property of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Eement} element
   * @argument {String} property
   */
  function getStyleComputedProperty(element, property) {
    if (element.nodeType !== 1) {
      return [];
    }
    // NOTE: 1 DOM access here
    var window = element.ownerDocument.defaultView;
    var css = window.getComputedStyle(element, null);
    return property ? css[property] : css;
  }

  /**
   * Returns the parentNode or the host of the element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} parent
   */
  function getParentNode(element) {
    if (element.nodeName === 'HTML') {
      return element;
    }
    return element.parentNode || element.host;
  }

  /**
   * Returns the scrolling parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} scroll parent
   */
  function getScrollParent(element) {
    // Return body, `getScroll` will take care to get the correct `scrollTop` from it
    if (!element) {
      return document.body;
    }

    switch (element.nodeName) {
      case 'HTML':
      case 'BODY':
        return element.ownerDocument.body;
      case '#document':
        return element.body;
    }

    // Firefox want us to check `-x` and `-y` variations as well

    var _getStyleComputedProp = getStyleComputedProperty(element),
        overflow = _getStyleComputedProp.overflow,
        overflowX = _getStyleComputedProp.overflowX,
        overflowY = _getStyleComputedProp.overflowY;

    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
      return element;
    }

    return getScrollParent(getParentNode(element));
  }

  /**
   * Returns the reference node of the reference object, or the reference object itself.
   * @method
   * @memberof Popper.Utils
   * @param {Element|Object} reference - the reference element (the popper will be relative to this)
   * @returns {Element} parent
   */
  function getReferenceNode(reference) {
    return reference && reference.referenceNode ? reference.referenceNode : reference;
  }

  var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
  var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

  /**
   * Determines if the browser is Internet Explorer
   * @method
   * @memberof Popper.Utils
   * @param {Number} version to check
   * @returns {Boolean} isIE
   */
  function isIE(version) {
    if (version === 11) {
      return isIE11;
    }
    if (version === 10) {
      return isIE10;
    }
    return isIE11 || isIE10;
  }

  /**
   * Returns the offset parent of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} offset parent
   */
  function getOffsetParent(element) {
    if (!element) {
      return document.documentElement;
    }

    var noOffsetParent = isIE(10) ? document.body : null;

    // NOTE: 1 DOM access here
    var offsetParent = element.offsetParent || null;
    // Skip hidden elements which don't have an offsetParent
    while (offsetParent === noOffsetParent && element.nextElementSibling) {
      offsetParent = (element = element.nextElementSibling).offsetParent;
    }

    var nodeName = offsetParent && offsetParent.nodeName;

    if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
      return element ? element.ownerDocument.documentElement : document.documentElement;
    }

    // .offsetParent will return the closest TH, TD or TABLE in case
    // no offsetParent is present, I hate this job...
    if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
      return getOffsetParent(offsetParent);
    }

    return offsetParent;
  }

  function isOffsetContainer(element) {
    var nodeName = element.nodeName;

    if (nodeName === 'BODY') {
      return false;
    }
    return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
  }

  /**
   * Finds the root node (document, shadowDOM root) of the given element
   * @method
   * @memberof Popper.Utils
   * @argument {Element} node
   * @returns {Element} root node
   */
  function getRoot(node) {
    if (node.parentNode !== null) {
      return getRoot(node.parentNode);
    }

    return node;
  }

  /**
   * Finds the offset parent common to the two provided nodes
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element1
   * @argument {Element} element2
   * @returns {Element} common offset parent
   */
  function findCommonOffsetParent(element1, element2) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
      return document.documentElement;
    }

    // Here we make sure to give as "start" the element that comes first in the DOM
    var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
    var start = order ? element1 : element2;
    var end = order ? element2 : element1;

    // Get common ancestor container
    var range = document.createRange();
    range.setStart(start, 0);
    range.setEnd(end, 0);
    var commonAncestorContainer = range.commonAncestorContainer;

    // Both nodes are inside #document

    if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
      if (isOffsetContainer(commonAncestorContainer)) {
        return commonAncestorContainer;
      }

      return getOffsetParent(commonAncestorContainer);
    }

    // one of the nodes is inside shadowDOM, find which one
    var element1root = getRoot(element1);
    if (element1root.host) {
      return findCommonOffsetParent(element1root.host, element2);
    } else {
      return findCommonOffsetParent(element1, getRoot(element2).host);
    }
  }

  /**
   * Gets the scroll value of the given element in the given side (top and left)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {String} side `top` or `left`
   * @returns {number} amount of scrolled pixels
   */
  function getScroll(element) {
    var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

    var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
    var nodeName = element.nodeName;

    if (nodeName === 'BODY' || nodeName === 'HTML') {
      var html = element.ownerDocument.documentElement;
      var scrollingElement = element.ownerDocument.scrollingElement || html;
      return scrollingElement[upperSide];
    }

    return element[upperSide];
  }

  /*
   * Sum or subtract the element scroll values (left and top) from a given rect object
   * @method
   * @memberof Popper.Utils
   * @param {Object} rect - Rect object you want to change
   * @param {HTMLElement} element - The element from the function reads the scroll values
   * @param {Boolean} subtract - set to true if you want to subtract the scroll values
   * @return {Object} rect - The modifier rect object
   */
  function includeScroll(rect, element) {
    var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var scrollTop = getScroll(element, 'top');
    var scrollLeft = getScroll(element, 'left');
    var modifier = subtract ? -1 : 1;
    rect.top += scrollTop * modifier;
    rect.bottom += scrollTop * modifier;
    rect.left += scrollLeft * modifier;
    rect.right += scrollLeft * modifier;
    return rect;
  }

  /*
   * Helper to detect borders of a given element
   * @method
   * @memberof Popper.Utils
   * @param {CSSStyleDeclaration} styles
   * Result of `getStyleComputedProperty` on the given element
   * @param {String} axis - `x` or `y`
   * @return {number} borders - The borders size of the given axis
   */

  function getBordersSize(styles, axis) {
    var sideA = axis === 'x' ? 'Left' : 'Top';
    var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

    return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
  }

  function getSize(axis, body, html, computedStyle) {
    return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
  }

  function getWindowSizes(document) {
    var body = document.body;
    var html = document.documentElement;
    var computedStyle = isIE(10) && getComputedStyle(html);

    return {
      height: getSize('Height', body, html, computedStyle),
      width: getSize('Width', body, html, computedStyle)
    };
  }

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();





  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
   * Given element offsets, generate an output similar to getBoundingClientRect
   * @method
   * @memberof Popper.Utils
   * @argument {Object} offsets
   * @returns {Object} ClientRect like output
   */
  function getClientRect(offsets) {
    return _extends({}, offsets, {
      right: offsets.left + offsets.width,
      bottom: offsets.top + offsets.height
    });
  }

  /**
   * Get bounding client rect of given element
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} element
   * @return {Object} client rect
   */
  function getBoundingClientRect(element) {
    var rect = {};

    // IE10 10 FIX: Please, don't ask, the element isn't
    // considered in DOM in some circumstances...
    // This isn't reproducible in IE10 compatibility mode of IE11
    try {
      if (isIE(10)) {
        rect = element.getBoundingClientRect();
        var scrollTop = getScroll(element, 'top');
        var scrollLeft = getScroll(element, 'left');
        rect.top += scrollTop;
        rect.left += scrollLeft;
        rect.bottom += scrollTop;
        rect.right += scrollLeft;
      } else {
        rect = element.getBoundingClientRect();
      }
    } catch (e) {}

    var result = {
      left: rect.left,
      top: rect.top,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };

    // subtract scrollbar size from sizes
    var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
    var width = sizes.width || element.clientWidth || result.width;
    var height = sizes.height || element.clientHeight || result.height;

    var horizScrollbar = element.offsetWidth - width;
    var vertScrollbar = element.offsetHeight - height;

    // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
    // we make this check conditional for performance reasons
    if (horizScrollbar || vertScrollbar) {
      var styles = getStyleComputedProperty(element);
      horizScrollbar -= getBordersSize(styles, 'x');
      vertScrollbar -= getBordersSize(styles, 'y');

      result.width -= horizScrollbar;
      result.height -= vertScrollbar;
    }

    return getClientRect(result);
  }

  function getOffsetRectRelativeToArbitraryNode(children, parent) {
    var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var isIE10 = isIE(10);
    var isHTML = parent.nodeName === 'HTML';
    var childrenRect = getBoundingClientRect(children);
    var parentRect = getBoundingClientRect(parent);
    var scrollParent = getScrollParent(children);

    var styles = getStyleComputedProperty(parent);
    var borderTopWidth = parseFloat(styles.borderTopWidth);
    var borderLeftWidth = parseFloat(styles.borderLeftWidth);

    // In cases where the parent is fixed, we must ignore negative scroll in offset calc
    if (fixedPosition && isHTML) {
      parentRect.top = Math.max(parentRect.top, 0);
      parentRect.left = Math.max(parentRect.left, 0);
    }
    var offsets = getClientRect({
      top: childrenRect.top - parentRect.top - borderTopWidth,
      left: childrenRect.left - parentRect.left - borderLeftWidth,
      width: childrenRect.width,
      height: childrenRect.height
    });
    offsets.marginTop = 0;
    offsets.marginLeft = 0;

    // Subtract margins of documentElement in case it's being used as parent
    // we do this only on HTML because it's the only element that behaves
    // differently when margins are applied to it. The margins are included in
    // the box of the documentElement, in the other cases not.
    if (!isIE10 && isHTML) {
      var marginTop = parseFloat(styles.marginTop);
      var marginLeft = parseFloat(styles.marginLeft);

      offsets.top -= borderTopWidth - marginTop;
      offsets.bottom -= borderTopWidth - marginTop;
      offsets.left -= borderLeftWidth - marginLeft;
      offsets.right -= borderLeftWidth - marginLeft;

      // Attach marginTop and marginLeft because in some circumstances we may need them
      offsets.marginTop = marginTop;
      offsets.marginLeft = marginLeft;
    }

    if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
      offsets = includeScroll(offsets, parent);
    }

    return offsets;
  }

  function getViewportOffsetRectRelativeToArtbitraryNode(element) {
    var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var html = element.ownerDocument.documentElement;
    var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
    var width = Math.max(html.clientWidth, window.innerWidth || 0);
    var height = Math.max(html.clientHeight, window.innerHeight || 0);

    var scrollTop = !excludeScroll ? getScroll(html) : 0;
    var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

    var offset = {
      top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
      left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
      width: width,
      height: height
    };

    return getClientRect(offset);
  }

  /**
   * Check if the given element is fixed or is inside a fixed parent
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @argument {Element} customContainer
   * @returns {Boolean} answer to "isFixed?"
   */
  function isFixed(element) {
    var nodeName = element.nodeName;
    if (nodeName === 'BODY' || nodeName === 'HTML') {
      return false;
    }
    if (getStyleComputedProperty(element, 'position') === 'fixed') {
      return true;
    }
    var parentNode = getParentNode(element);
    if (!parentNode) {
      return false;
    }
    return isFixed(parentNode);
  }

  /**
   * Finds the first parent of an element that has a transformed property defined
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Element} first transformed parent or documentElement
   */

  function getFixedPositionOffsetParent(element) {
    // This check is needed to avoid errors in case one of the elements isn't defined for any reason
    if (!element || !element.parentElement || isIE()) {
      return document.documentElement;
    }
    var el = element.parentElement;
    while (el && getStyleComputedProperty(el, 'transform') === 'none') {
      el = el.parentElement;
    }
    return el || document.documentElement;
  }

  /**
   * Computed the boundaries limits and return them
   * @method
   * @memberof Popper.Utils
   * @param {HTMLElement} popper
   * @param {HTMLElement} reference
   * @param {number} padding
   * @param {HTMLElement} boundariesElement - Element used to define the boundaries
   * @param {Boolean} fixedPosition - Is in fixed position mode
   * @returns {Object} Coordinates of the boundaries
   */
  function getBoundaries(popper, reference, padding, boundariesElement) {
    var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

    // NOTE: 1 DOM access here

    var boundaries = { top: 0, left: 0 };
    var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

    // Handle viewport case
    if (boundariesElement === 'viewport') {
      boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
    } else {
      // Handle other cases based on DOM element used as boundaries
      var boundariesNode = void 0;
      if (boundariesElement === 'scrollParent') {
        boundariesNode = getScrollParent(getParentNode(reference));
        if (boundariesNode.nodeName === 'BODY') {
          boundariesNode = popper.ownerDocument.documentElement;
        }
      } else if (boundariesElement === 'window') {
        boundariesNode = popper.ownerDocument.documentElement;
      } else {
        boundariesNode = boundariesElement;
      }

      var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

      // In case of HTML, we need a different computation
      if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
        var _getWindowSizes = getWindowSizes(popper.ownerDocument),
            height = _getWindowSizes.height,
            width = _getWindowSizes.width;

        boundaries.top += offsets.top - offsets.marginTop;
        boundaries.bottom = height + offsets.top;
        boundaries.left += offsets.left - offsets.marginLeft;
        boundaries.right = width + offsets.left;
      } else {
        // for all the other DOM elements, this one is good
        boundaries = offsets;
      }
    }

    // Add paddings
    padding = padding || 0;
    var isPaddingNumber = typeof padding === 'number';
    boundaries.left += isPaddingNumber ? padding : padding.left || 0;
    boundaries.top += isPaddingNumber ? padding : padding.top || 0;
    boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
    boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

    return boundaries;
  }

  function getArea(_ref) {
    var width = _ref.width,
        height = _ref.height;

    return width * height;
  }

  /**
   * Utility used to transform the `auto` placement to the placement with more
   * available space.
   * @method
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    if (placement.indexOf('auto') === -1) {
      return placement;
    }

    var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

    var rects = {
      top: {
        width: boundaries.width,
        height: refRect.top - boundaries.top
      },
      right: {
        width: boundaries.right - refRect.right,
        height: boundaries.height
      },
      bottom: {
        width: boundaries.width,
        height: boundaries.bottom - refRect.bottom
      },
      left: {
        width: refRect.left - boundaries.left,
        height: boundaries.height
      }
    };

    var sortedAreas = Object.keys(rects).map(function (key) {
      return _extends({
        key: key
      }, rects[key], {
        area: getArea(rects[key])
      });
    }).sort(function (a, b) {
      return b.area - a.area;
    });

    var filteredAreas = sortedAreas.filter(function (_ref2) {
      var width = _ref2.width,
          height = _ref2.height;
      return width >= popper.clientWidth && height >= popper.clientHeight;
    });

    var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

    var variation = placement.split('-')[1];

    return computedPlacement + (variation ? '-' + variation : '');
  }

  /**
   * Get offsets to the reference element
   * @method
   * @memberof Popper.Utils
   * @param {Object} state
   * @param {Element} popper - the popper element
   * @param {Element} reference - the reference element (the popper will be relative to this)
   * @param {Element} fixedPosition - is in fixed position mode
   * @returns {Object} An object containing the offsets which will be applied to the popper
   */
  function getReferenceOffsets(state, popper, reference) {
    var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
    return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
  }

  /**
   * Get the outer sizes of the given element (offset size + margins)
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element
   * @returns {Object} object containing width and height properties
   */
  function getOuterSizes(element) {
    var window = element.ownerDocument.defaultView;
    var styles = window.getComputedStyle(element);
    var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
    var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
    var result = {
      width: element.offsetWidth + y,
      height: element.offsetHeight + x
    };
    return result;
  }

  /**
   * Get the opposite placement of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement
   * @returns {String} flipped placement
   */
  function getOppositePlacement(placement) {
    var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash[matched];
    });
  }

  /**
   * Get offsets to the popper
   * @method
   * @memberof Popper.Utils
   * @param {Object} position - CSS position the Popper will get applied
   * @param {HTMLElement} popper - the popper element
   * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
   * @param {String} placement - one of the valid placement options
   * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
   */
  function getPopperOffsets(popper, referenceOffsets, placement) {
    placement = placement.split('-')[0];

    // Get popper node sizes
    var popperRect = getOuterSizes(popper);

    // Add position, width and height to our offsets object
    var popperOffsets = {
      width: popperRect.width,
      height: popperRect.height
    };

    // depending by the popper placement we have to compute its offsets slightly differently
    var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
    var mainSide = isHoriz ? 'top' : 'left';
    var secondarySide = isHoriz ? 'left' : 'top';
    var measurement = isHoriz ? 'height' : 'width';
    var secondaryMeasurement = !isHoriz ? 'height' : 'width';

    popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
    if (placement === secondarySide) {
      popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
    } else {
      popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
    }

    return popperOffsets;
  }

  /**
   * Mimics the `find` method of Array
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function find(arr, check) {
    // use native find if supported
    if (Array.prototype.find) {
      return arr.find(check);
    }

    // use `filter` to obtain the same behavior of `find`
    return arr.filter(check)[0];
  }

  /**
   * Return the index of the matching object
   * @method
   * @memberof Popper.Utils
   * @argument {Array} arr
   * @argument prop
   * @argument value
   * @returns index or -1
   */
  function findIndex(arr, prop, value) {
    // use native findIndex if supported
    if (Array.prototype.findIndex) {
      return arr.findIndex(function (cur) {
        return cur[prop] === value;
      });
    }

    // use `find` + `indexOf` if `findIndex` isn't supported
    var match = find(arr, function (obj) {
      return obj[prop] === value;
    });
    return arr.indexOf(match);
  }

  /**
   * Loop trough the list of modifiers and run them in order,
   * each of them will then edit the data object.
   * @method
   * @memberof Popper.Utils
   * @param {dataObject} data
   * @param {Array} modifiers
   * @param {String} ends - Optional modifier name used as stopper
   * @returns {dataObject}
   */
  function runModifiers(modifiers, data, ends) {
    var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

    modifiersToRun.forEach(function (modifier) {
      if (modifier['function']) {
        // eslint-disable-line dot-notation
        console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
      }
      var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
      if (modifier.enabled && isFunction(fn)) {
        // Add properties to offsets to make them a complete clientRect object
        // we do this before each modifier to make sure the previous one doesn't
        // mess with these values
        data.offsets.popper = getClientRect(data.offsets.popper);
        data.offsets.reference = getClientRect(data.offsets.reference);

        data = fn(data, modifier);
      }
    });

    return data;
  }

  /**
   * Updates the position of the popper, computing the new offsets and applying
   * the new style.<br />
   * Prefer `scheduleUpdate` over `update` because of performance reasons.
   * @method
   * @memberof Popper
   */
  function update() {
    // if popper is destroyed, don't perform any further update
    if (this.state.isDestroyed) {
      return;
    }

    var data = {
      instance: this,
      styles: {},
      arrowStyles: {},
      attributes: {},
      flipped: false,
      offsets: {}
    };

    // compute reference element offsets
    data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

    // store the computed placement inside `originalPlacement`
    data.originalPlacement = data.placement;

    data.positionFixed = this.options.positionFixed;

    // compute the popper offsets
    data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

    data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

    // run the modifiers
    data = runModifiers(this.modifiers, data);

    // the first `update` will call `onCreate` callback
    // the other ones will call `onUpdate` callback
    if (!this.state.isCreated) {
      this.state.isCreated = true;
      this.options.onCreate(data);
    } else {
      this.options.onUpdate(data);
    }
  }

  /**
   * Helper used to know if the given modifier is enabled.
   * @method
   * @memberof Popper.Utils
   * @returns {Boolean}
   */
  function isModifierEnabled(modifiers, modifierName) {
    return modifiers.some(function (_ref) {
      var name = _ref.name,
          enabled = _ref.enabled;
      return enabled && name === modifierName;
    });
  }

  /**
   * Get the prefixed supported property name
   * @method
   * @memberof Popper.Utils
   * @argument {String} property (camelCase)
   * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
   */
  function getSupportedPropertyName(property) {
    var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
    var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

    for (var i = 0; i < prefixes.length; i++) {
      var prefix = prefixes[i];
      var toCheck = prefix ? '' + prefix + upperProp : property;
      if (typeof document.body.style[toCheck] !== 'undefined') {
        return toCheck;
      }
    }
    return null;
  }

  /**
   * Destroys the popper.
   * @method
   * @memberof Popper
   */
  function destroy() {
    this.state.isDestroyed = true;

    // touch DOM only if `applyStyle` modifier is enabled
    if (isModifierEnabled(this.modifiers, 'applyStyle')) {
      this.popper.removeAttribute('x-placement');
      this.popper.style.position = '';
      this.popper.style.top = '';
      this.popper.style.left = '';
      this.popper.style.right = '';
      this.popper.style.bottom = '';
      this.popper.style.willChange = '';
      this.popper.style[getSupportedPropertyName('transform')] = '';
    }

    this.disableEventListeners();

    // remove the popper if user explicitly asked for the deletion on destroy
    // do not use `remove` because IE11 doesn't support it
    if (this.options.removeOnDestroy) {
      this.popper.parentNode.removeChild(this.popper);
    }
    return this;
  }

  /**
   * Get the window associated with the element
   * @argument {Element} element
   * @returns {Window}
   */
  function getWindow(element) {
    var ownerDocument = element.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView : window;
  }

  function attachToScrollParents(scrollParent, event, callback, scrollParents) {
    var isBody = scrollParent.nodeName === 'BODY';
    var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
    target.addEventListener(event, callback, { passive: true });

    if (!isBody) {
      attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
    }
    scrollParents.push(target);
  }

  /**
   * Setup needed event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function setupEventListeners(reference, options, state, updateBound) {
    // Resize event listener on window
    state.updateBound = updateBound;
    getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

    // Scroll event listener on scroll parents
    var scrollElement = getScrollParent(reference);
    attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
    state.scrollElement = scrollElement;
    state.eventsEnabled = true;

    return state;
  }

  /**
   * It will add resize/scroll events and start recalculating
   * position of the popper element when they are triggered.
   * @method
   * @memberof Popper
   */
  function enableEventListeners() {
    if (!this.state.eventsEnabled) {
      this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
    }
  }

  /**
   * Remove event listeners used to update the popper position
   * @method
   * @memberof Popper.Utils
   * @private
   */
  function removeEventListeners(reference, state) {
    // Remove resize event listener on window
    getWindow(reference).removeEventListener('resize', state.updateBound);

    // Remove scroll event listener on scroll parents
    state.scrollParents.forEach(function (target) {
      target.removeEventListener('scroll', state.updateBound);
    });

    // Reset state
    state.updateBound = null;
    state.scrollParents = [];
    state.scrollElement = null;
    state.eventsEnabled = false;
    return state;
  }

  /**
   * It will remove resize/scroll events and won't recalculate popper position
   * when they are triggered. It also won't trigger `onUpdate` callback anymore,
   * unless you call `update` method manually.
   * @method
   * @memberof Popper
   */
  function disableEventListeners() {
    if (this.state.eventsEnabled) {
      cancelAnimationFrame(this.scheduleUpdate);
      this.state = removeEventListeners(this.reference, this.state);
    }
  }

  /**
   * Tells if a given input is a number
   * @method
   * @memberof Popper.Utils
   * @param {*} input to check
   * @return {Boolean}
   */
  function isNumeric(n) {
    return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Set the style to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the style to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setStyles(element, styles) {
    Object.keys(styles).forEach(function (prop) {
      var unit = '';
      // add unit if the value is numeric and is one of the following
      if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
        unit = 'px';
      }
      element.style[prop] = styles[prop] + unit;
    });
  }

  /**
   * Set the attributes to the given popper
   * @method
   * @memberof Popper.Utils
   * @argument {Element} element - Element to apply the attributes to
   * @argument {Object} styles
   * Object with a list of properties and values which will be applied to the element
   */
  function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function (prop) {
      var value = attributes[prop];
      if (value !== false) {
        element.setAttribute(prop, attributes[prop]);
      } else {
        element.removeAttribute(prop);
      }
    });
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} data.styles - List of style properties - values to apply to popper element
   * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The same data object
   */
  function applyStyle(data) {
    // any property present in `data.styles` will be applied to the popper,
    // in this way we can make the 3rd party modifiers add custom styles to it
    // Be aware, modifiers could override the properties defined in the previous
    // lines of this modifier!
    setStyles(data.instance.popper, data.styles);

    // any property present in `data.attributes` will be applied to the popper,
    // they will be set as HTML attributes of the element
    setAttributes(data.instance.popper, data.attributes);

    // if arrowElement is defined and arrowStyles has some properties
    if (data.arrowElement && Object.keys(data.arrowStyles).length) {
      setStyles(data.arrowElement, data.arrowStyles);
    }

    return data;
  }

  /**
   * Set the x-placement attribute before everything else because it could be used
   * to add margins to the popper margins needs to be calculated to get the
   * correct popper offsets.
   * @method
   * @memberof Popper.modifiers
   * @param {HTMLElement} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper
   * @param {Object} options - Popper.js options
   */
  function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
    // compute reference element offsets
    var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

    // compute auto placement, store placement inside the data object,
    // modifiers will be able to edit `placement` if needed
    // and refer to originalPlacement to know the original value
    var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

    popper.setAttribute('x-placement', placement);

    // Apply `position` to popper before anything else because
    // without the position applied we can't guarantee correct computations
    setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

    return options;
  }

  /**
   * @function
   * @memberof Popper.Utils
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Boolean} shouldRound - If the offsets should be rounded at all
   * @returns {Object} The popper's position offsets rounded
   *
   * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
   * good as it can be within reason.
   * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
   *
   * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
   * as well on High DPI screens).
   *
   * Firefox prefers no rounding for positioning and does not have blurriness on
   * high DPI screens.
   *
   * Only horizontal placement and left/right values need to be considered.
   */
  function getRoundedOffsets(data, shouldRound) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;
    var round = Math.round,
        floor = Math.floor;

    var noRound = function noRound(v) {
      return v;
    };

    var referenceWidth = round(reference.width);
    var popperWidth = round(popper.width);

    var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
    var isVariation = data.placement.indexOf('-') !== -1;
    var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
    var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

    var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
    var verticalToInteger = !shouldRound ? noRound : round;

    return {
      left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
      top: verticalToInteger(popper.top),
      bottom: verticalToInteger(popper.bottom),
      right: horizontalToInteger(popper.right)
    };
  }

  var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function computeStyle(data, options) {
    var x = options.x,
        y = options.y;
    var popper = data.offsets.popper;

    // Remove this legacy support in Popper.js v2

    var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'applyStyle';
    }).gpuAcceleration;
    if (legacyGpuAccelerationOption !== undefined) {
      console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
    }
    var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

    var offsetParent = getOffsetParent(data.instance.popper);
    var offsetParentRect = getBoundingClientRect(offsetParent);

    // Styles
    var styles = {
      position: popper.position
    };

    var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

    var sideA = x === 'bottom' ? 'top' : 'bottom';
    var sideB = y === 'right' ? 'left' : 'right';

    // if gpuAcceleration is set to `true` and transform is supported,
    //  we use `translate3d` to apply the position to the popper we
    // automatically use the supported prefixed version if needed
    var prefixedProperty = getSupportedPropertyName('transform');

    // now, let's make a step back and look at this code closely (wtf?)
    // If the content of the popper grows once it's been positioned, it
    // may happen that the popper gets misplaced because of the new content
    // overflowing its reference element
    // To avoid this problem, we provide two options (x and y), which allow
    // the consumer to define the offset origin.
    // If we position a popper on top of a reference element, we can set
    // `x` to `top` to make the popper grow towards its top instead of
    // its bottom.
    var left = void 0,
        top = void 0;
    if (sideA === 'bottom') {
      // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
      // and not the bottom of the html element
      if (offsetParent.nodeName === 'HTML') {
        top = -offsetParent.clientHeight + offsets.bottom;
      } else {
        top = -offsetParentRect.height + offsets.bottom;
      }
    } else {
      top = offsets.top;
    }
    if (sideB === 'right') {
      if (offsetParent.nodeName === 'HTML') {
        left = -offsetParent.clientWidth + offsets.right;
      } else {
        left = -offsetParentRect.width + offsets.right;
      }
    } else {
      left = offsets.left;
    }
    if (gpuAcceleration && prefixedProperty) {
      styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
      styles[sideA] = 0;
      styles[sideB] = 0;
      styles.willChange = 'transform';
    } else {
      // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
      var invertTop = sideA === 'bottom' ? -1 : 1;
      var invertLeft = sideB === 'right' ? -1 : 1;
      styles[sideA] = top * invertTop;
      styles[sideB] = left * invertLeft;
      styles.willChange = sideA + ', ' + sideB;
    }

    // Attributes
    var attributes = {
      'x-placement': data.placement
    };

    // Update `data` attributes, styles and arrowStyles
    data.attributes = _extends({}, attributes, data.attributes);
    data.styles = _extends({}, styles, data.styles);
    data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

    return data;
  }

  /**
   * Helper used to know if the given modifier depends from another one.<br />
   * It checks if the needed modifier is listed and enabled.
   * @method
   * @memberof Popper.Utils
   * @param {Array} modifiers - list of modifiers
   * @param {String} requestingName - name of requesting modifier
   * @param {String} requestedName - name of requested modifier
   * @returns {Boolean}
   */
  function isModifierRequired(modifiers, requestingName, requestedName) {
    var requesting = find(modifiers, function (_ref) {
      var name = _ref.name;
      return name === requestingName;
    });

    var isRequired = !!requesting && modifiers.some(function (modifier) {
      return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
    });

    if (!isRequired) {
      var _requesting = '`' + requestingName + '`';
      var requested = '`' + requestedName + '`';
      console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
    }
    return isRequired;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function arrow(data, options) {
    var _data$offsets$arrow;

    // arrow depends on keepTogether in order to work
    if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
      return data;
    }

    var arrowElement = options.element;

    // if arrowElement is a string, suppose it's a CSS selector
    if (typeof arrowElement === 'string') {
      arrowElement = data.instance.popper.querySelector(arrowElement);

      // if arrowElement is not found, don't run the modifier
      if (!arrowElement) {
        return data;
      }
    } else {
      // if the arrowElement isn't a query selector we must check that the
      // provided DOM node is child of its popper node
      if (!data.instance.popper.contains(arrowElement)) {
        console.warn('WARNING: `arrow.element` must be child of its popper element!');
        return data;
      }
    }

    var placement = data.placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isVertical = ['left', 'right'].indexOf(placement) !== -1;

    var len = isVertical ? 'height' : 'width';
    var sideCapitalized = isVertical ? 'Top' : 'Left';
    var side = sideCapitalized.toLowerCase();
    var altSide = isVertical ? 'left' : 'top';
    var opSide = isVertical ? 'bottom' : 'right';
    var arrowElementSize = getOuterSizes(arrowElement)[len];

    //
    // extends keepTogether behavior making sure the popper and its
    // reference have enough pixels in conjunction
    //

    // top/left side
    if (reference[opSide] - arrowElementSize < popper[side]) {
      data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
    }
    // bottom/right side
    if (reference[side] + arrowElementSize > popper[opSide]) {
      data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
    }
    data.offsets.popper = getClientRect(data.offsets.popper);

    // compute center of the popper
    var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

    // Compute the sideValue using the updated popper offsets
    // take popper margin in account because we don't have this info available
    var css = getStyleComputedProperty(data.instance.popper);
    var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
    var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
    var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

    // prevent arrowElement from being placed not contiguously to its popper
    sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

    data.arrowElement = arrowElement;
    data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

    return data;
  }

  /**
   * Get the opposite placement variation of the given one
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement variation
   * @returns {String} flipped placement variation
   */
  function getOppositeVariation(variation) {
    if (variation === 'end') {
      return 'start';
    } else if (variation === 'start') {
      return 'end';
    }
    return variation;
  }

  /**
   * List of accepted placements to use as values of the `placement` option.<br />
   * Valid placements are:
   * - `auto`
   * - `top`
   * - `right`
   * - `bottom`
   * - `left`
   *
   * Each placement can have a variation from this list:
   * - `-start`
   * - `-end`
   *
   * Variations are interpreted easily if you think of them as the left to right
   * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
   * is right.<br />
   * Vertically (`left` and `right`), `start` is top and `end` is bottom.
   *
   * Some valid examples are:
   * - `top-end` (on top of reference, right aligned)
   * - `right-start` (on right of reference, top aligned)
   * - `bottom` (on bottom, centered)
   * - `auto-end` (on the side with more space available, alignment depends by placement)
   *
   * @static
   * @type {Array}
   * @enum {String}
   * @readonly
   * @method placements
   * @memberof Popper
   */
  var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

  // Get rid of `auto` `auto-start` and `auto-end`
  var validPlacements = placements.slice(3);

  /**
   * Given an initial placement, returns all the subsequent placements
   * clockwise (or counter-clockwise).
   *
   * @method
   * @memberof Popper.Utils
   * @argument {String} placement - A valid placement (it accepts variations)
   * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
   * @returns {Array} placements including their variations
   */
  function clockwise(placement) {
    var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var index = validPlacements.indexOf(placement);
    var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
    return counter ? arr.reverse() : arr;
  }

  var BEHAVIORS = {
    FLIP: 'flip',
    CLOCKWISE: 'clockwise',
    COUNTERCLOCKWISE: 'counterclockwise'
  };

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function flip(data, options) {
    // if `inner` modifier is enabled, we can't use the `flip` modifier
    if (isModifierEnabled(data.instance.modifiers, 'inner')) {
      return data;
    }

    if (data.flipped && data.placement === data.originalPlacement) {
      // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
      return data;
    }

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

    var placement = data.placement.split('-')[0];
    var placementOpposite = getOppositePlacement(placement);
    var variation = data.placement.split('-')[1] || '';

    var flipOrder = [];

    switch (options.behavior) {
      case BEHAVIORS.FLIP:
        flipOrder = [placement, placementOpposite];
        break;
      case BEHAVIORS.CLOCKWISE:
        flipOrder = clockwise(placement);
        break;
      case BEHAVIORS.COUNTERCLOCKWISE:
        flipOrder = clockwise(placement, true);
        break;
      default:
        flipOrder = options.behavior;
    }

    flipOrder.forEach(function (step, index) {
      if (placement !== step || flipOrder.length === index + 1) {
        return data;
      }

      placement = data.placement.split('-')[0];
      placementOpposite = getOppositePlacement(placement);

      var popperOffsets = data.offsets.popper;
      var refOffsets = data.offsets.reference;

      // using floor because the reference offsets may contain decimals we are not going to consider here
      var floor = Math.floor;
      var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

      var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
      var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
      var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
      var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

      var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

      // flip the variation if required
      var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

      // flips variation if reference element overflows boundaries
      var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

      // flips variation if popper content overflows boundaries
      var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

      var flippedVariation = flippedVariationByRef || flippedVariationByContent;

      if (overlapsRef || overflowsBoundaries || flippedVariation) {
        // this boolean to detect any flip loop
        data.flipped = true;

        if (overlapsRef || overflowsBoundaries) {
          placement = flipOrder[index + 1];
        }

        if (flippedVariation) {
          variation = getOppositeVariation(variation);
        }

        data.placement = placement + (variation ? '-' + variation : '');

        // this object contains `position`, we want to preserve it along with
        // any additional property we may add in the future
        data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

        data = runModifiers(data.instance.modifiers, data, 'flip');
      }
    });
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function keepTogether(data) {
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var placement = data.placement.split('-')[0];
    var floor = Math.floor;
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var side = isVertical ? 'right' : 'bottom';
    var opSide = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    if (popper[side] < floor(reference[opSide])) {
      data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
    }
    if (popper[opSide] > floor(reference[side])) {
      data.offsets.popper[opSide] = floor(reference[side]);
    }

    return data;
  }

  /**
   * Converts a string containing value + unit into a px value number
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} str - Value + unit string
   * @argument {String} measurement - `height` or `width`
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @returns {Number|String}
   * Value in pixels, or original string if no values were extracted
   */
  function toValue(str, measurement, popperOffsets, referenceOffsets) {
    // separate value from unit
    var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
    var value = +split[1];
    var unit = split[2];

    // If it's not a number it's an operator, I guess
    if (!value) {
      return str;
    }

    if (unit.indexOf('%') === 0) {
      var element = void 0;
      switch (unit) {
        case '%p':
          element = popperOffsets;
          break;
        case '%':
        case '%r':
        default:
          element = referenceOffsets;
      }

      var rect = getClientRect(element);
      return rect[measurement] / 100 * value;
    } else if (unit === 'vh' || unit === 'vw') {
      // if is a vh or vw, we calculate the size based on the viewport
      var size = void 0;
      if (unit === 'vh') {
        size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      } else {
        size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      }
      return size / 100 * value;
    } else {
      // if is an explicit pixel unit, we get rid of the unit and keep the value
      // if is an implicit unit, it's px, and we return just the value
      return value;
    }
  }

  /**
   * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
   * @function
   * @memberof {modifiers~offset}
   * @private
   * @argument {String} offset
   * @argument {Object} popperOffsets
   * @argument {Object} referenceOffsets
   * @argument {String} basePlacement
   * @returns {Array} a two cells array with x and y offsets in numbers
   */
  function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
    var offsets = [0, 0];

    // Use height if placement is left or right and index is 0 otherwise use width
    // in this way the first offset will use an axis and the second one
    // will use the other one
    var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

    // Split the offset string to obtain a list of values and operands
    // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
    var fragments = offset.split(/(\+|\-)/).map(function (frag) {
      return frag.trim();
    });

    // Detect if the offset string contains a pair of values or a single one
    // they could be separated by comma or space
    var divider = fragments.indexOf(find(fragments, function (frag) {
      return frag.search(/,|\s/) !== -1;
    }));

    if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
      console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
    }

    // If divider is found, we divide the list of values and operands to divide
    // them by ofset X and Y.
    var splitRegex = /\s*,\s*|\s+/;
    var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

    // Convert the values with units to absolute pixels to allow our computations
    ops = ops.map(function (op, index) {
      // Most of the units rely on the orientation of the popper
      var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
      var mergeWithPrevious = false;
      return op
      // This aggregates any `+` or `-` sign that aren't considered operators
      // e.g.: 10 + +5 => [10, +, +5]
      .reduce(function (a, b) {
        if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
          a[a.length - 1] = b;
          mergeWithPrevious = true;
          return a;
        } else if (mergeWithPrevious) {
          a[a.length - 1] += b;
          mergeWithPrevious = false;
          return a;
        } else {
          return a.concat(b);
        }
      }, [])
      // Here we convert the string values into number values (in px)
      .map(function (str) {
        return toValue(str, measurement, popperOffsets, referenceOffsets);
      });
    });

    // Loop trough the offsets arrays and execute the operations
    ops.forEach(function (op, index) {
      op.forEach(function (frag, index2) {
        if (isNumeric(frag)) {
          offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
        }
      });
    });
    return offsets;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @argument {Number|String} options.offset=0
   * The offset value as described in the modifier description
   * @returns {Object} The data object, properly modified
   */
  function offset(data, _ref) {
    var offset = _ref.offset;
    var placement = data.placement,
        _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var basePlacement = placement.split('-')[0];

    var offsets = void 0;
    if (isNumeric(+offset)) {
      offsets = [+offset, 0];
    } else {
      offsets = parseOffset(offset, popper, reference, basePlacement);
    }

    if (basePlacement === 'left') {
      popper.top += offsets[0];
      popper.left -= offsets[1];
    } else if (basePlacement === 'right') {
      popper.top += offsets[0];
      popper.left += offsets[1];
    } else if (basePlacement === 'top') {
      popper.left += offsets[0];
      popper.top -= offsets[1];
    } else if (basePlacement === 'bottom') {
      popper.left += offsets[0];
      popper.top += offsets[1];
    }

    data.popper = popper;
    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function preventOverflow(data, options) {
    var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

    // If offsetParent is the reference element, we really want to
    // go one step up and use the next offsetParent as reference to
    // avoid to make this modifier completely useless and look like broken
    if (data.instance.reference === boundariesElement) {
      boundariesElement = getOffsetParent(boundariesElement);
    }

    // NOTE: DOM access here
    // resets the popper's position so that the document size can be calculated excluding
    // the size of the popper element itself
    var transformProp = getSupportedPropertyName('transform');
    var popperStyles = data.instance.popper.style; // assignment to help minification
    var top = popperStyles.top,
        left = popperStyles.left,
        transform = popperStyles[transformProp];

    popperStyles.top = '';
    popperStyles.left = '';
    popperStyles[transformProp] = '';

    var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

    // NOTE: DOM access here
    // restores the original style properties after the offsets have been computed
    popperStyles.top = top;
    popperStyles.left = left;
    popperStyles[transformProp] = transform;

    options.boundaries = boundaries;

    var order = options.priority;
    var popper = data.offsets.popper;

    var check = {
      primary: function primary(placement) {
        var value = popper[placement];
        if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
          value = Math.max(popper[placement], boundaries[placement]);
        }
        return defineProperty({}, placement, value);
      },
      secondary: function secondary(placement) {
        var mainSide = placement === 'right' ? 'left' : 'top';
        var value = popper[mainSide];
        if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
          value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
        }
        return defineProperty({}, mainSide, value);
      }
    };

    order.forEach(function (placement) {
      var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
      popper = _extends({}, popper, check[side](placement));
    });

    data.offsets.popper = popper;

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function shift(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var shiftvariation = placement.split('-')[1];

    // if shift shiftvariation is specified, run the modifier
    if (shiftvariation) {
      var _data$offsets = data.offsets,
          reference = _data$offsets.reference,
          popper = _data$offsets.popper;

      var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
      var side = isVertical ? 'left' : 'top';
      var measurement = isVertical ? 'width' : 'height';

      var shiftOffsets = {
        start: defineProperty({}, side, reference[side]),
        end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
      };

      data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by update method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function hide(data) {
    if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
      return data;
    }

    var refRect = data.offsets.reference;
    var bound = find(data.instance.modifiers, function (modifier) {
      return modifier.name === 'preventOverflow';
    }).boundaries;

    if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === true) {
        return data;
      }

      data.hide = true;
      data.attributes['x-out-of-boundaries'] = '';
    } else {
      // Avoid unnecessary DOM access if visibility hasn't changed
      if (data.hide === false) {
        return data;
      }

      data.hide = false;
      data.attributes['x-out-of-boundaries'] = false;
    }

    return data;
  }

  /**
   * @function
   * @memberof Modifiers
   * @argument {Object} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {Object} The data object, properly modified
   */
  function inner(data) {
    var placement = data.placement;
    var basePlacement = placement.split('-')[0];
    var _data$offsets = data.offsets,
        popper = _data$offsets.popper,
        reference = _data$offsets.reference;

    var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

    var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

    popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

    data.placement = getOppositePlacement(placement);
    data.offsets.popper = getClientRect(popper);

    return data;
  }

  /**
   * Modifier function, each modifier can have a function of this type assigned
   * to its `fn` property.<br />
   * These functions will be called on each update, this means that you must
   * make sure they are performant enough to avoid performance bottlenecks.
   *
   * @function ModifierFn
   * @argument {dataObject} data - The data object generated by `update` method
   * @argument {Object} options - Modifiers configuration and options
   * @returns {dataObject} The data object, properly modified
   */

  /**
   * Modifiers are plugins used to alter the behavior of your poppers.<br />
   * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
   * needed by the library.
   *
   * Usually you don't want to override the `order`, `fn` and `onLoad` props.
   * All the other properties are configurations that could be tweaked.
   * @namespace modifiers
   */
  var modifiers = {
    /**
     * Modifier used to shift the popper on the start or end of its reference
     * element.<br />
     * It will read the variation of the `placement` property.<br />
     * It can be one either `-end` or `-start`.
     * @memberof modifiers
     * @inner
     */
    shift: {
      /** @prop {number} order=100 - Index used to define the order of execution */
      order: 100,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: shift
    },

    /**
     * The `offset` modifier can shift your popper on both its axis.
     *
     * It accepts the following units:
     * - `px` or unit-less, interpreted as pixels
     * - `%` or `%r`, percentage relative to the length of the reference element
     * - `%p`, percentage relative to the length of the popper element
     * - `vw`, CSS viewport width unit
     * - `vh`, CSS viewport height unit
     *
     * For length is intended the main axis relative to the placement of the popper.<br />
     * This means that if the placement is `top` or `bottom`, the length will be the
     * `width`. In case of `left` or `right`, it will be the `height`.
     *
     * You can provide a single value (as `Number` or `String`), or a pair of values
     * as `String` divided by a comma or one (or more) white spaces.<br />
     * The latter is a deprecated method because it leads to confusion and will be
     * removed in v2.<br />
     * Additionally, it accepts additions and subtractions between different units.
     * Note that multiplications and divisions aren't supported.
     *
     * Valid examples are:
     * ```
     * 10
     * '10%'
     * '10, 10'
     * '10%, 10'
     * '10 + 10%'
     * '10 - 5vh + 3%'
     * '-10px + 5vh, 5px - 6%'
     * ```
     * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
     * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
     * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
     *
     * @memberof modifiers
     * @inner
     */
    offset: {
      /** @prop {number} order=200 - Index used to define the order of execution */
      order: 200,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: offset,
      /** @prop {Number|String} offset=0
       * The offset value as described in the modifier description
       */
      offset: 0
    },

    /**
     * Modifier used to prevent the popper from being positioned outside the boundary.
     *
     * A scenario exists where the reference itself is not within the boundaries.<br />
     * We can say it has "escaped the boundaries" — or just "escaped".<br />
     * In this case we need to decide whether the popper should either:
     *
     * - detach from the reference and remain "trapped" in the boundaries, or
     * - if it should ignore the boundary and "escape with its reference"
     *
     * When `escapeWithReference` is set to`true` and reference is completely
     * outside its boundaries, the popper will overflow (or completely leave)
     * the boundaries in order to remain attached to the edge of the reference.
     *
     * @memberof modifiers
     * @inner
     */
    preventOverflow: {
      /** @prop {number} order=300 - Index used to define the order of execution */
      order: 300,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: preventOverflow,
      /**
       * @prop {Array} [priority=['left','right','top','bottom']]
       * Popper will try to prevent overflow following these priorities by default,
       * then, it could overflow on the left and on top of the `boundariesElement`
       */
      priority: ['left', 'right', 'top', 'bottom'],
      /**
       * @prop {number} padding=5
       * Amount of pixel used to define a minimum distance between the boundaries
       * and the popper. This makes sure the popper always has a little padding
       * between the edges of its container
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='scrollParent'
       * Boundaries used by the modifier. Can be `scrollParent`, `window`,
       * `viewport` or any DOM element.
       */
      boundariesElement: 'scrollParent'
    },

    /**
     * Modifier used to make sure the reference and its popper stay near each other
     * without leaving any gap between the two. Especially useful when the arrow is
     * enabled and you want to ensure that it points to its reference element.
     * It cares only about the first axis. You can still have poppers with margin
     * between the popper and its reference element.
     * @memberof modifiers
     * @inner
     */
    keepTogether: {
      /** @prop {number} order=400 - Index used to define the order of execution */
      order: 400,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: keepTogether
    },

    /**
     * This modifier is used to move the `arrowElement` of the popper to make
     * sure it is positioned between the reference element and its popper element.
     * It will read the outer size of the `arrowElement` node to detect how many
     * pixels of conjunction are needed.
     *
     * It has no effect if no `arrowElement` is provided.
     * @memberof modifiers
     * @inner
     */
    arrow: {
      /** @prop {number} order=500 - Index used to define the order of execution */
      order: 500,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: arrow,
      /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
      element: '[x-arrow]'
    },

    /**
     * Modifier used to flip the popper's placement when it starts to overlap its
     * reference element.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     *
     * **NOTE:** this modifier will interrupt the current update cycle and will
     * restart it if it detects the need to flip the placement.
     * @memberof modifiers
     * @inner
     */
    flip: {
      /** @prop {number} order=600 - Index used to define the order of execution */
      order: 600,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: flip,
      /**
       * @prop {String|Array} behavior='flip'
       * The behavior used to change the popper's placement. It can be one of
       * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
       * placements (with optional variations)
       */
      behavior: 'flip',
      /**
       * @prop {number} padding=5
       * The popper will flip if it hits the edges of the `boundariesElement`
       */
      padding: 5,
      /**
       * @prop {String|HTMLElement} boundariesElement='viewport'
       * The element which will define the boundaries of the popper position.
       * The popper will never be placed outside of the defined boundaries
       * (except if `keepTogether` is enabled)
       */
      boundariesElement: 'viewport',
      /**
       * @prop {Boolean} flipVariations=false
       * The popper will switch placement variation between `-start` and `-end` when
       * the reference element overlaps its boundaries.
       *
       * The original placement should have a set variation.
       */
      flipVariations: false,
      /**
       * @prop {Boolean} flipVariationsByContent=false
       * The popper will switch placement variation between `-start` and `-end` when
       * the popper element overlaps its reference boundaries.
       *
       * The original placement should have a set variation.
       */
      flipVariationsByContent: false
    },

    /**
     * Modifier used to make the popper flow toward the inner of the reference element.
     * By default, when this modifier is disabled, the popper will be placed outside
     * the reference element.
     * @memberof modifiers
     * @inner
     */
    inner: {
      /** @prop {number} order=700 - Index used to define the order of execution */
      order: 700,
      /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
      enabled: false,
      /** @prop {ModifierFn} */
      fn: inner
    },

    /**
     * Modifier used to hide the popper when its reference element is outside of the
     * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
     * be used to hide with a CSS selector the popper when its reference is
     * out of boundaries.
     *
     * Requires the `preventOverflow` modifier before it in order to work.
     * @memberof modifiers
     * @inner
     */
    hide: {
      /** @prop {number} order=800 - Index used to define the order of execution */
      order: 800,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: hide
    },

    /**
     * Computes the style that will be applied to the popper element to gets
     * properly positioned.
     *
     * Note that this modifier will not touch the DOM, it just prepares the styles
     * so that `applyStyle` modifier can apply it. This separation is useful
     * in case you need to replace `applyStyle` with a custom implementation.
     *
     * This modifier has `850` as `order` value to maintain backward compatibility
     * with previous versions of Popper.js. Expect the modifiers ordering method
     * to change in future major versions of the library.
     *
     * @memberof modifiers
     * @inner
     */
    computeStyle: {
      /** @prop {number} order=850 - Index used to define the order of execution */
      order: 850,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: computeStyle,
      /**
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: true,
      /**
       * @prop {string} [x='bottom']
       * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
       * Change this if your popper should grow in a direction different from `bottom`
       */
      x: 'bottom',
      /**
       * @prop {string} [x='left']
       * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
       * Change this if your popper should grow in a direction different from `right`
       */
      y: 'right'
    },

    /**
     * Applies the computed styles to the popper element.
     *
     * All the DOM manipulations are limited to this modifier. This is useful in case
     * you want to integrate Popper.js inside a framework or view library and you
     * want to delegate all the DOM manipulations to it.
     *
     * Note that if you disable this modifier, you must make sure the popper element
     * has its position set to `absolute` before Popper.js can do its work!
     *
     * Just disable this modifier and define your own to achieve the desired effect.
     *
     * @memberof modifiers
     * @inner
     */
    applyStyle: {
      /** @prop {number} order=900 - Index used to define the order of execution */
      order: 900,
      /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
      enabled: true,
      /** @prop {ModifierFn} */
      fn: applyStyle,
      /** @prop {Function} */
      onLoad: applyStyleOnLoad,
      /**
       * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
       * @prop {Boolean} gpuAcceleration=true
       * If true, it uses the CSS 3D transformation to position the popper.
       * Otherwise, it will use the `top` and `left` properties
       */
      gpuAcceleration: undefined
    }
  };

  /**
   * The `dataObject` is an object containing all the information used by Popper.js.
   * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
   * @name dataObject
   * @property {Object} data.instance The Popper.js instance
   * @property {String} data.placement Placement applied to popper
   * @property {String} data.originalPlacement Placement originally defined on init
   * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
   * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
   * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
   * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
   * @property {Object} data.boundaries Offsets of the popper boundaries
   * @property {Object} data.offsets The measurements of popper, reference and arrow elements
   * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
   * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
   */

  /**
   * Default options provided to Popper.js constructor.<br />
   * These can be overridden using the `options` argument of Popper.js.<br />
   * To override an option, simply pass an object with the same
   * structure of the `options` object, as the 3rd argument. For example:
   * ```
   * new Popper(ref, pop, {
   *   modifiers: {
   *     preventOverflow: { enabled: false }
   *   }
   * })
   * ```
   * @type {Object}
   * @static
   * @memberof Popper
   */
  var Defaults = {
    /**
     * Popper's placement.
     * @prop {Popper.placements} placement='bottom'
     */
    placement: 'bottom',

    /**
     * Set this to true if you want popper to position it self in 'fixed' mode
     * @prop {Boolean} positionFixed=false
     */
    positionFixed: false,

    /**
     * Whether events (resize, scroll) are initially enabled.
     * @prop {Boolean} eventsEnabled=true
     */
    eventsEnabled: true,

    /**
     * Set to true if you want to automatically remove the popper when
     * you call the `destroy` method.
     * @prop {Boolean} removeOnDestroy=false
     */
    removeOnDestroy: false,

    /**
     * Callback called when the popper is created.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onCreate}
     */
    onCreate: function onCreate() {},

    /**
     * Callback called when the popper is updated. This callback is not called
     * on the initialization/creation of the popper, but only on subsequent
     * updates.<br />
     * By default, it is set to no-op.<br />
     * Access Popper.js instance with `data.instance`.
     * @prop {onUpdate}
     */
    onUpdate: function onUpdate() {},

    /**
     * List of modifiers used to modify the offsets before they are applied to the popper.
     * They provide most of the functionalities of Popper.js.
     * @prop {modifiers}
     */
    modifiers: modifiers
  };

  /**
   * @callback onCreate
   * @param {dataObject} data
   */

  /**
   * @callback onUpdate
   * @param {dataObject} data
   */

  // Utils
  // Methods
  var Popper = function () {
    /**
     * Creates a new Popper.js instance.
     * @class Popper
     * @param {Element|referenceObject} reference - The reference element used to position the popper
     * @param {Element} popper - The HTML / XML element used as the popper
     * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
     * @return {Object} instance - The generated Popper.js instance
     */
    function Popper(reference, popper) {
      var _this = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      classCallCheck(this, Popper);

      this.scheduleUpdate = function () {
        return requestAnimationFrame(_this.update);
      };

      // make update() debounced, so that it only runs at most once-per-tick
      this.update = debounce(this.update.bind(this));

      // with {} we create a new object with the options inside it
      this.options = _extends({}, Popper.Defaults, options);

      // init state
      this.state = {
        isDestroyed: false,
        isCreated: false,
        scrollParents: []
      };

      // get reference and popper elements (allow jQuery wrappers)
      this.reference = reference && reference.jquery ? reference[0] : reference;
      this.popper = popper && popper.jquery ? popper[0] : popper;

      // Deep merge modifiers options
      this.options.modifiers = {};
      Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
        _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
      });

      // Refactoring modifiers' list (Object => Array)
      this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
        return _extends({
          name: name
        }, _this.options.modifiers[name]);
      })
      // sort the modifiers by order
      .sort(function (a, b) {
        return a.order - b.order;
      });

      // modifiers have the ability to execute arbitrary code when Popper.js get inited
      // such code is executed in the same order of its modifier
      // they could add new properties to their options configuration
      // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
      this.modifiers.forEach(function (modifierOptions) {
        if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
          modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
        }
      });

      // fire the first update to position the popper in the right place
      this.update();

      var eventsEnabled = this.options.eventsEnabled;
      if (eventsEnabled) {
        // setup event listeners, they will take care of update the position in specific situations
        this.enableEventListeners();
      }

      this.state.eventsEnabled = eventsEnabled;
    }

    // We can't use class properties because they don't get listed in the
    // class prototype and break stuff like Sinon stubs


    createClass(Popper, [{
      key: 'update',
      value: function update$$1() {
        return update.call(this);
      }
    }, {
      key: 'destroy',
      value: function destroy$$1() {
        return destroy.call(this);
      }
    }, {
      key: 'enableEventListeners',
      value: function enableEventListeners$$1() {
        return enableEventListeners.call(this);
      }
    }, {
      key: 'disableEventListeners',
      value: function disableEventListeners$$1() {
        return disableEventListeners.call(this);
      }

      /**
       * Schedules an update. It will run on the next UI update available.
       * @method scheduleUpdate
       * @memberof Popper
       */


      /**
       * Collection of utilities useful when writing custom modifiers.
       * Starting from version 1.7, this method is available only if you
       * include `popper-utils.js` before `popper.js`.
       *
       * **DEPRECATION**: This way to access PopperUtils is deprecated
       * and will be removed in v2! Use the PopperUtils module directly instead.
       * Due to the high instability of the methods contained in Utils, we can't
       * guarantee them to follow semver. Use them at your own risk!
       * @static
       * @private
       * @type {Object}
       * @deprecated since version 1.8
       * @member Utils
       * @memberof Popper
       */

    }]);
    return Popper;
  }();

  /**
   * The `referenceObject` is an object that provides an interface compatible with Popper.js
   * and lets you use it as replacement of a real DOM node.<br />
   * You can use this method to position a popper relatively to a set of coordinates
   * in case you don't have a DOM node to use as reference.
   *
   * ```
   * new Popper(referenceObject, popperNode);
   * ```
   *
   * NB: This feature isn't supported in Internet Explorer 10.
   * @name referenceObject
   * @property {Function} data.getBoundingClientRect
   * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
   * @property {number} data.clientWidth
   * An ES6 getter that will return the width of the virtual reference element.
   * @property {number} data.clientHeight
   * An ES6 getter that will return the height of the virtual reference element.
   */


  Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
  Popper.placements = placements;
  Popper.Defaults = Defaults;

  var Popper$1 = Popper;

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$6 = 'dropdown';
  const VERSION$6 = '4.6.0';
  const DATA_KEY$6 = 'bs.dropdown';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const JQUERY_NO_CONFLICT$6 = $__default['default'].fn[NAME$6];
  const ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key
  const SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
  const TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
  const ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
  const ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
  const RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE$1}`);

  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_CLICK = `click${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;

  const CLASS_NAME_DISABLED$1 = 'disabled';
  const CLASS_NAME_SHOW$5 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPRIGHT = 'dropright';
  const CLASS_NAME_DROPLEFT = 'dropleft';
  const CLASS_NAME_MENURIGHT = 'dropdown-menu-right';
  const CLASS_NAME_POSITION_STATIC = 'position-static';

  const SELECTOR_DATA_TOGGLE$2 = '[data-toggle="dropdown"]';
  const SELECTOR_FORM_CHILD = '.dropdown form';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';

  const PLACEMENT_TOP = 'top-start';
  const PLACEMENT_TOPEND = 'top-end';
  const PLACEMENT_BOTTOM = 'bottom-start';
  const PLACEMENT_BOTTOMEND = 'bottom-end';
  const PLACEMENT_RIGHT = 'right-start';
  const PLACEMENT_LEFT = 'left-start';

  const Default$5 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null
  };

  const DefaultType$5 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string',
    popperConfig: '(null|object)'
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown {
    constructor(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    }

    // Getters

    static get VERSION() {
      return VERSION$6
    }

    static get Default() {
      return Default$5
    }

    static get DefaultType() {
      return DefaultType$5
    }

    // Public

    toggle() {
      if (this._element.disabled || $__default['default'](this._element).hasClass(CLASS_NAME_DISABLED$1)) {
        return
      }

      const isActive = $__default['default'](this._menu).hasClass(CLASS_NAME_SHOW$5);

      Dropdown._clearMenus();

      if (isActive) {
        return
      }

      this.show(true);
    }

    show(usePopper = false) {
      if (this._element.disabled || $__default['default'](this._element).hasClass(CLASS_NAME_DISABLED$1) || $__default['default'](this._menu).hasClass(CLASS_NAME_SHOW$5)) {
        return
      }

      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = $__default['default'].Event(EVENT_SHOW$3, relatedTarget);
      const parent = Dropdown._getParentFromElement(this._element);

      $__default['default'](parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return
      }

      // Totally disable Popper for Dropdowns in Navbar
      if (!this._inNavbar && usePopper) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper$1 === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)')
        }

        let referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference;

          // Check if it's jQuery element
          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        }

        // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251
        if (this._config.boundary !== 'scrollParent') {
          $__default['default'](parent).addClass(CLASS_NAME_POSITION_STATIC);
        }

        this._popper = new Popper$1(referenceElement, this._menu, this._getPopperConfig());
      }

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement &&
          $__default['default'](parent).closest(SELECTOR_NAVBAR_NAV).length === 0) {
        $__default['default'](document.body).children().on('mouseover', null, $__default['default'].noop);
      }

      this._element.focus();
      this._element.setAttribute('aria-expanded', true);

      $__default['default'](this._menu).toggleClass(CLASS_NAME_SHOW$5);
      $__default['default'](parent)
        .toggleClass(CLASS_NAME_SHOW$5)
        .trigger($__default['default'].Event(EVENT_SHOWN$3, relatedTarget));
    }

    hide() {
      if (this._element.disabled || $__default['default'](this._element).hasClass(CLASS_NAME_DISABLED$1) || !$__default['default'](this._menu).hasClass(CLASS_NAME_SHOW$5)) {
        return
      }

      const relatedTarget = {
        relatedTarget: this._element
      };
      const hideEvent = $__default['default'].Event(EVENT_HIDE$3, relatedTarget);
      const parent = Dropdown._getParentFromElement(this._element);

      $__default['default'](parent).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return
      }

      if (this._popper) {
        this._popper.destroy();
      }

      $__default['default'](this._menu).toggleClass(CLASS_NAME_SHOW$5);
      $__default['default'](parent)
        .toggleClass(CLASS_NAME_SHOW$5)
        .trigger($__default['default'].Event(EVENT_HIDDEN$3, relatedTarget));
    }

    dispose() {
      $__default['default'].removeData(this._element, DATA_KEY$6);
      $__default['default'](this._element).off(EVENT_KEY$6);
      this._element = null;
      this._menu = null;
      if (this._popper !== null) {
        this._popper.destroy();
        this._popper = null;
      }
    }

    update() {
      this._inNavbar = this._detectNavbar();
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }

    // Private

    _addEventListeners() {
      $__default['default'](this._element).on(EVENT_CLICK, event => {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
      });
    }

    _getConfig(config) {
      config = {
        ...this.constructor.Default,
        ...$__default['default'](this._element).data(),
        ...config
      };

      Util.typeCheckConfig(
        NAME$6,
        config,
        this.constructor.DefaultType
      );

      return config
    }

    _getMenuElement() {
      if (!this._menu) {
        const parent = Dropdown._getParentFromElement(this._element);

        if (parent) {
          this._menu = parent.querySelector(SELECTOR_MENU);
        }
      }

      return this._menu
    }

    _getPlacement() {
      const $parentDropdown = $__default['default'](this._element.parentNode);
      let placement = PLACEMENT_BOTTOM;

      // Handle dropup
      if ($parentDropdown.hasClass(CLASS_NAME_DROPUP)) {
        placement = $__default['default'](this._menu).hasClass(CLASS_NAME_MENURIGHT) ?
          PLACEMENT_TOPEND :
          PLACEMENT_TOP;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPRIGHT)) {
        placement = PLACEMENT_RIGHT;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPLEFT)) {
        placement = PLACEMENT_LEFT;
      } else if ($__default['default'](this._menu).hasClass(CLASS_NAME_MENURIGHT)) {
        placement = PLACEMENT_BOTTOMEND;
      }

      return placement
    }

    _detectNavbar() {
      return $__default['default'](this._element).closest('.navbar').length > 0
    }

    _getOffset() {
      const offset = {};

      if (typeof this._config.offset === 'function') {
        offset.fn = data => {
          data.offsets = {
            ...data.offsets,
            ...(this._config.offset(data.offsets, this._element) || {})
          };

          return data
        };
      } else {
        offset.offset = this._config.offset;
      }

      return offset
    }

    _getPopperConfig() {
      const popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: this._getOffset(),
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        }
      };

      // Disable Popper if we have a static display
      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return {
        ...popperConfig,
        ...this._config.popperConfig
      }
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $__default['default'](this).data(DATA_KEY$6);
        const _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $__default['default'](this).data(DATA_KEY$6, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config]();
        }
      })
    }

    static _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
        event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return
      }

      const toggles = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$2));

      for (let i = 0, len = toggles.length; i < len; i++) {
        const parent = Dropdown._getParentFromElement(toggles[i]);
        const context = $__default['default'](toggles[i]).data(DATA_KEY$6);
        const relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue
        }

        const dropdownMenu = context._menu;
        if (!$__default['default'](parent).hasClass(CLASS_NAME_SHOW$5)) {
          continue
        }

        if (event && (event.type === 'click' &&
            /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) &&
            $__default['default'].contains(parent, event.target)) {
          continue
        }

        const hideEvent = $__default['default'].Event(EVENT_HIDE$3, relatedTarget);
        $__default['default'](parent).trigger(hideEvent);
        if (hideEvent.isDefaultPrevented()) {
          continue
        }

        // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $__default['default'](document.body).children().off('mouseover', null, $__default['default'].noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');

        if (context._popper) {
          context._popper.destroy();
        }

        $__default['default'](dropdownMenu).removeClass(CLASS_NAME_SHOW$5);
        $__default['default'](parent)
          .removeClass(CLASS_NAME_SHOW$5)
          .trigger($__default['default'].Event(EVENT_HIDDEN$3, relatedTarget));
      }
    }

    static _getParentFromElement(element) {
      let parent;
      const selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = document.querySelector(selector);
      }

      return parent || element.parentNode
    }

    // eslint-disable-next-line complexity
    static _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ?
        event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE$1 &&
        (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE ||
          $__default['default'](event.target).closest(SELECTOR_MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return
      }

      if (this.disabled || $__default['default'](this).hasClass(CLASS_NAME_DISABLED$1)) {
        return
      }

      const parent = Dropdown._getParentFromElement(this);
      const isActive = $__default['default'](parent).hasClass(CLASS_NAME_SHOW$5);

      if (!isActive && event.which === ESCAPE_KEYCODE$1) {
        return
      }

      event.preventDefault();
      event.stopPropagation();

      if (!isActive || (event.which === ESCAPE_KEYCODE$1 || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE$1) {
          $__default['default'](parent.querySelector(SELECTOR_DATA_TOGGLE$2)).trigger('focus');
        }

        $__default['default'](this).trigger('click');
        return
      }

      const items = [].slice.call(parent.querySelectorAll(SELECTOR_VISIBLE_ITEMS))
        .filter(item => $__default['default'](item).is(':visible'));

      if (items.length === 0) {
        return
      }

      let index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) { // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](document)
    .on(EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$2, Dropdown._dataApiKeydownHandler)
    .on(EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown._dataApiKeydownHandler)
    .on(`${EVENT_CLICK_DATA_API$2} ${EVENT_KEYUP_DATA_API}`, Dropdown._clearMenus)
    .on(EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
      event.preventDefault();
      event.stopPropagation();
      Dropdown._jQueryInterface.call($__default['default'](this), 'toggle');
    })
    .on(EVENT_CLICK_DATA_API$2, SELECTOR_FORM_CHILD, e => {
      e.stopPropagation();
    });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$6] = Dropdown._jQueryInterface;
  $__default['default'].fn[NAME$6].Constructor = Dropdown;
  $__default['default'].fn[NAME$6].noConflict = () => {
    $__default['default'].fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Dropdown._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$5 = 'modal';
  const VERSION$5 = '4.6.0';
  const DATA_KEY$5 = 'bs.modal';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const JQUERY_NO_CONFLICT$5 = $__default['default'].fn[NAME$5];
  const ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  const Default$4 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };

  const DefaultType$4 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };

  const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$5}`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
  const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY$5}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$5}`;
  const EVENT_CLICK_DISMISS$1 = `click.dismiss${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$5}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$5}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;

  const CLASS_NAME_SCROLLABLE = 'modal-dialog-scrollable';
  const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
  const CLASS_NAME_BACKDROP = 'modal-backdrop';
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$4 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';

  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$1 = '[data-toggle="modal"]';
  const SELECTOR_DATA_DISMISS$1 = '[data-dismiss="modal"]';
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal {
    constructor(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(SELECTOR_DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    }

    // Getters

    static get VERSION() {
      return VERSION$5
    }

    static get Default() {
      return Default$4
    }

    // Public

    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget)
    }

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return
      }

      if ($__default['default'](this._element).hasClass(CLASS_NAME_FADE$4)) {
        this._isTransitioning = true;
      }

      const showEvent = $__default['default'].Event(EVENT_SHOW$2, {
        relatedTarget
      });

      $__default['default'](this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return
      }

      this._isShown = true;

      this._checkScrollbar();
      this._setScrollbar();

      this._adjustDialog();

      this._setEscapeEvent();
      this._setResizeEvent();

      $__default['default'](this._element).on(
        EVENT_CLICK_DISMISS$1,
        SELECTOR_DATA_DISMISS$1,
        event => this.hide(event)
      );

      $__default['default'](this._dialog).on(EVENT_MOUSEDOWN_DISMISS, () => {
        $__default['default'](this._element).one(EVENT_MOUSEUP_DISMISS, event => {
          if ($__default['default'](event.target).is(this._element)) {
            this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(() => this._showElement(relatedTarget));
    }

    hide(event) {
      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return
      }

      const hideEvent = $__default['default'].Event(EVENT_HIDE$2);

      $__default['default'](this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return
      }

      this._isShown = false;
      const transition = $__default['default'](this._element).hasClass(CLASS_NAME_FADE$4);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();
      this._setResizeEvent();

      $__default['default'](document).off(EVENT_FOCUSIN);

      $__default['default'](this._element).removeClass(CLASS_NAME_SHOW$4);

      $__default['default'](this._element).off(EVENT_CLICK_DISMISS$1);
      $__default['default'](this._dialog).off(EVENT_MOUSEDOWN_DISMISS);

      if (transition) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._element);

        $__default['default'](this._element)
          .one(Util.TRANSITION_END, event => this._hideModal(event))
          .emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    }

    dispose() {
      [window, this._element, this._dialog]
        .forEach(htmlElement => $__default['default'](htmlElement).off(EVENT_KEY$5));

      /**
       * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `EVENT_CLICK_DATA_API` event that should remain
       */
      $__default['default'](document).off(EVENT_FOCUSIN);

      $__default['default'].removeData(this._element, DATA_KEY$5);

      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    }

    handleUpdate() {
      this._adjustDialog();
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default$4,
        ...config
      };
      Util.typeCheckConfig(NAME$5, config, DefaultType$4);
      return config
    }

    _triggerBackdropTransition() {
      const hideEventPrevented = $__default['default'].Event(EVENT_HIDE_PREVENTED);

      $__default['default'](this._element).trigger(hideEventPrevented);
      if (hideEventPrevented.isDefaultPrevented()) {
        return
      }

      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }

      this._element.classList.add(CLASS_NAME_STATIC);

      const modalTransitionDuration = Util.getTransitionDurationFromElement(this._dialog);
      $__default['default'](this._element).off(Util.TRANSITION_END);

      $__default['default'](this._element).one(Util.TRANSITION_END, () => {
        this._element.classList.remove(CLASS_NAME_STATIC);
        if (!isModalOverflowing) {
          $__default['default'](this._element).one(Util.TRANSITION_END, () => {
            this._element.style.overflowY = '';
          })
            .emulateTransitionEnd(this._element, modalTransitionDuration);
        }
      })
        .emulateTransitionEnd(modalTransitionDuration);
      this._element.focus();
    }

    _showElement(relatedTarget) {
      const transition = $__default['default'](this._element).hasClass(CLASS_NAME_FADE$4);
      const modalBody = this._dialog ? this._dialog.querySelector(SELECTOR_MODAL_BODY) : null;

      if (!this._element.parentNode ||
          this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';
      this._element.removeAttribute('aria-hidden');
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');

      if ($__default['default'](this._dialog).hasClass(CLASS_NAME_SCROLLABLE) && modalBody) {
        modalBody.scrollTop = 0;
      } else {
        this._element.scrollTop = 0;
      }

      if (transition) {
        Util.reflow(this._element);
      }

      $__default['default'](this._element).addClass(CLASS_NAME_SHOW$4);

      if (this._config.focus) {
        this._enforceFocus();
      }

      const shownEvent = $__default['default'].Event(EVENT_SHOWN$2, {
        relatedTarget
      });

      const transitionComplete = () => {
        if (this._config.focus) {
          this._element.focus();
        }

        this._isTransitioning = false;
        $__default['default'](this._element).trigger(shownEvent);
      };

      if (transition) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._dialog);

        $__default['default'](this._dialog)
          .one(Util.TRANSITION_END, transitionComplete)
          .emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    }

    _enforceFocus() {
      $__default['default'](document)
        .off(EVENT_FOCUSIN) // Guard against infinite focus loop
        .on(EVENT_FOCUSIN, event => {
          if (document !== event.target &&
              this._element !== event.target &&
              $__default['default'](this._element).has(event.target).length === 0) {
            this._element.focus();
          }
        });
    }

    _setEscapeEvent() {
      if (this._isShown) {
        $__default['default'](this._element).on(EVENT_KEYDOWN_DISMISS, event => {
          if (this._config.keyboard && event.which === ESCAPE_KEYCODE) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.which === ESCAPE_KEYCODE) {
            this._triggerBackdropTransition();
          }
        });
      } else if (!this._isShown) {
        $__default['default'](this._element).off(EVENT_KEYDOWN_DISMISS);
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        $__default['default'](window).on(EVENT_RESIZE, event => this.handleUpdate(event));
      } else {
        $__default['default'](window).off(EVENT_RESIZE);
      }
    }

    _hideModal() {
      this._element.style.display = 'none';
      this._element.setAttribute('aria-hidden', true);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      this._isTransitioning = false;
      this._showBackdrop(() => {
        $__default['default'](document.body).removeClass(CLASS_NAME_OPEN);
        this._resetAdjustments();
        this._resetScrollbar();
        $__default['default'](this._element).trigger(EVENT_HIDDEN$2);
      });
    }

    _removeBackdrop() {
      if (this._backdrop) {
        $__default['default'](this._backdrop).remove();
        this._backdrop = null;
      }
    }

    _showBackdrop(callback) {
      const animate = $__default['default'](this._element).hasClass(CLASS_NAME_FADE$4) ?
        CLASS_NAME_FADE$4 : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = CLASS_NAME_BACKDROP;

        if (animate) {
          this._backdrop.classList.add(animate);
        }

        $__default['default'](this._backdrop).appendTo(document.body);

        $__default['default'](this._element).on(EVENT_CLICK_DISMISS$1, event => {
          if (this._ignoreBackdropClick) {
            this._ignoreBackdropClick = false;
            return
          }

          if (event.target !== event.currentTarget) {
            return
          }

          if (this._config.backdrop === 'static') {
            this._triggerBackdropTransition();
          } else {
            this.hide();
          }
        });

        if (animate) {
          Util.reflow(this._backdrop);
        }

        $__default['default'](this._backdrop).addClass(CLASS_NAME_SHOW$4);

        if (!callback) {
          return
        }

        if (!animate) {
          callback();
          return
        }

        const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

        $__default['default'](this._backdrop)
          .one(Util.TRANSITION_END, callback)
          .emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $__default['default'](this._backdrop).removeClass(CLASS_NAME_SHOW$4);

        const callbackRemove = () => {
          this._removeBackdrop();
          if (callback) {
            callback();
          }
        };

        if ($__default['default'](this._element).hasClass(CLASS_NAME_FADE$4)) {
          const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $__default['default'](this._backdrop)
            .one(Util.TRANSITION_END, callbackRemove)
            .emulateTransitionEnd(backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }

    // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------

    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = `${this._scrollbarWidth}px`;
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = `${this._scrollbarWidth}px`;
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    }

    _checkScrollbar() {
      const rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    }

    _setScrollbar() {
      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
        const stickyContent = [].slice.call(document.querySelectorAll(SELECTOR_STICKY_CONTENT));

        // Adjust fixed content padding
        $__default['default'](fixedContent).each((index, element) => {
          const actualPadding = element.style.paddingRight;
          const calculatedPadding = $__default['default'](element).css('padding-right');
          $__default['default'](element)
            .data('padding-right', actualPadding)
            .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`);
        });

        // Adjust sticky content margin
        $__default['default'](stickyContent).each((index, element) => {
          const actualMargin = element.style.marginRight;
          const calculatedMargin = $__default['default'](element).css('margin-right');
          $__default['default'](element)
            .data('margin-right', actualMargin)
            .css('margin-right', `${parseFloat(calculatedMargin) - this._scrollbarWidth}px`);
        });

        // Adjust body padding
        const actualPadding = document.body.style.paddingRight;
        const calculatedPadding = $__default['default'](document.body).css('padding-right');
        $__default['default'](document.body)
          .data('padding-right', actualPadding)
          .css('padding-right', `${parseFloat(calculatedPadding) + this._scrollbarWidth}px`);
      }

      $__default['default'](document.body).addClass(CLASS_NAME_OPEN);
    }

    _resetScrollbar() {
      // Restore fixed content padding
      const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
      $__default['default'](fixedContent).each((index, element) => {
        const padding = $__default['default'](element).data('padding-right');
        $__default['default'](element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      });

      // Restore sticky content
      const elements = [].slice.call(document.querySelectorAll(`${SELECTOR_STICKY_CONTENT}`));
      $__default['default'](elements).each((index, element) => {
        const margin = $__default['default'](element).data('margin-right');
        if (typeof margin !== 'undefined') {
          $__default['default'](element).css('margin-right', margin).removeData('margin-right');
        }
      });

      // Restore body padding
      const padding = $__default['default'](document.body).data('padding-right');
      $__default['default'](document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    }

    _getScrollbarWidth() { // thx d.walsh
      const scrollDiv = document.createElement('div');
      scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth
    }

    // Static

    static _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        let data = $__default['default'](this).data(DATA_KEY$5);
        const _config = {
          ...Default$4,
          ...$__default['default'](this).data(),
          ...(typeof config === 'object' && config ? config : {})
        };

        if (!data) {
          data = new Modal(this, _config);
          $__default['default'](this).data(DATA_KEY$5, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](document).on(EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    let target;
    const selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = document.querySelector(selector);
    }

    const config = $__default['default'](target).data(DATA_KEY$5) ?
      'toggle' : {
        ...$__default['default'](target).data(),
        ...$__default['default'](this).data()
      };

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    const $target = $__default['default'](target).one(EVENT_SHOW$2, showEvent => {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return
      }

      $target.one(EVENT_HIDDEN$2, () => {
        if ($__default['default'](this).is(':visible')) {
          this.focus();
        }
      });
    });

    Modal._jQueryInterface.call($__default['default'](target), config, this);
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$5] = Modal._jQueryInterface;
  $__default['default'].fn[NAME$5].Constructor = Modal;
  $__default['default'].fn[NAME$5].noConflict = () => {
    $__default['default'].fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const uriAttrs = [
    'background',
    'cite',
    'href',
    'itemtype',
    'longdesc',
    'poster',
    'src',
    'xlink:href'
  ];

  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;

  const DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };

  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi;

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    const attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN))
      }

      return true
    }

    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp);

    // Check if a regular expression validates the attribute.
    for (let i = 0, len = regExp.length; i < len; i++) {
      if (attrName.match(regExp[i])) {
        return true
      }
    }

    return false
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml)
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const whitelistKeys = Object.keys(whiteList);
    const elements = [].slice.call(createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();

      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);

        continue
      }

      const attributeList = [].slice.call(el.attributes);
      const whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);

      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    }

    return createdDocument.body.innerHTML
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$4 = 'tooltip';
  const VERSION$4 = '4.6.0';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const JQUERY_NO_CONFLICT$4 = $__default['default'].fn[NAME$4];
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const BSCLS_PREFIX_REGEX$1 = new RegExp(`(^|\\s)${CLASS_PREFIX$1}\\S+`, 'g');
  const DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];

  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    whiteList: 'object',
    popperConfig: '(null|object)'
  };

  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };

  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' +
                      '<div class="arrow"></div>' +
                      '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist,
    popperConfig: null
  };

  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';

  const Event$1 = {
    HIDE: `hide${EVENT_KEY$4}`,
    HIDDEN: `hidden${EVENT_KEY$4}`,
    SHOW: `show${EVENT_KEY$4}`,
    SHOWN: `shown${EVENT_KEY$4}`,
    INSERTED: `inserted${EVENT_KEY$4}`,
    CLICK: `click${EVENT_KEY$4}`,
    FOCUSIN: `focusin${EVENT_KEY$4}`,
    FOCUSOUT: `focusout${EVENT_KEY$4}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
  };

  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_SHOW$3 = 'show';

  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const SELECTOR_ARROW = '.arrow';

  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip {
    constructor(element, config) {
      if (typeof Popper$1 === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)')
      }

      // private
      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null;

      // Protected
      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    }

    // Getters

    static get VERSION() {
      return VERSION$4
    }

    static get Default() {
      return Default$3
    }

    static get NAME() {
      return NAME$4
    }

    static get DATA_KEY() {
      return DATA_KEY$4
    }

    static get Event() {
      return Event$1
    }

    static get EVENT_KEY() {
      return EVENT_KEY$4
    }

    static get DefaultType() {
      return DefaultType$3
    }

    // Public

    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }

    toggle(event) {
      if (!this._isEnabled) {
        return
      }

      if (event) {
        const dataKey = this.constructor.DATA_KEY;
        let context = $__default['default'](event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(
            event.currentTarget,
            this._getDelegateConfig()
          );
          $__default['default'](event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($__default['default'](this.getTipElement()).hasClass(CLASS_NAME_SHOW$3)) {
          this._leave(null, this);
          return
        }

        this._enter(null, this);
      }
    }

    dispose() {
      clearTimeout(this._timeout);

      $__default['default'].removeData(this.element, this.constructor.DATA_KEY);

      $__default['default'](this.element).off(this.constructor.EVENT_KEY);
      $__default['default'](this.element).closest('.modal').off('hide.bs.modal', this._hideModalHandler);

      if (this.tip) {
        $__default['default'](this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;
      if (this._popper) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    }

    show() {
      if ($__default['default'](this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements')
      }

      const showEvent = $__default['default'].Event(this.constructor.Event.SHOW);
      if (this.isWithContent() && this._isEnabled) {
        $__default['default'](this.element).trigger(showEvent);

        const shadowRoot = Util.findShadowRoot(this.element);
        const isInTheDom = $__default['default'].contains(
          shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement,
          this.element
        );

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return
        }

        const tip = this.getTipElement();
        const tipId = Util.getUID(this.constructor.NAME);

        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);

        this.setContent();

        if (this.config.animation) {
          $__default['default'](tip).addClass(CLASS_NAME_FADE$3);
        }

        const placement = typeof this.config.placement === 'function' ?
          this.config.placement.call(this, tip, this.element) :
          this.config.placement;

        const attachment = this._getAttachment(placement);
        this.addAttachmentClass(attachment);

        const container = this._getContainer();
        $__default['default'](tip).data(this.constructor.DATA_KEY, this);

        if (!$__default['default'].contains(this.element.ownerDocument.documentElement, this.tip)) {
          $__default['default'](tip).appendTo(container);
        }

        $__default['default'](this.element).trigger(this.constructor.Event.INSERTED);

        this._popper = new Popper$1(this.element, tip, this._getPopperConfig(attachment));

        $__default['default'](tip).addClass(CLASS_NAME_SHOW$3);
        $__default['default'](tip).addClass(this.config.customClass);

        // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
        if ('ontouchstart' in document.documentElement) {
          $__default['default'](document.body).children().on('mouseover', null, $__default['default'].noop);
        }

        const complete = () => {
          if (this.config.animation) {
            this._fixTransition();
          }

          const prevHoverState = this._hoverState;
          this._hoverState = null;

          $__default['default'](this.element).trigger(this.constructor.Event.SHOWN);

          if (prevHoverState === HOVER_STATE_OUT) {
            this._leave(null, this);
          }
        };

        if ($__default['default'](this.tip).hasClass(CLASS_NAME_FADE$3)) {
          const transitionDuration = Util.getTransitionDurationFromElement(this.tip);

          $__default['default'](this.tip)
            .one(Util.TRANSITION_END, complete)
            .emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    }

    hide(callback) {
      const tip = this.getTipElement();
      const hideEvent = $__default['default'].Event(this.constructor.Event.HIDE);
      const complete = () => {
        if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        this._cleanTipClass();
        this.element.removeAttribute('aria-describedby');
        $__default['default'](this.element).trigger(this.constructor.Event.HIDDEN);
        if (this._popper !== null) {
          this._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $__default['default'](this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return
      }

      $__default['default'](tip).removeClass(CLASS_NAME_SHOW$3);

      // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support
      if ('ontouchstart' in document.documentElement) {
        $__default['default'](document.body).children().off('mouseover', null, $__default['default'].noop);
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;

      if ($__default['default'](this.tip).hasClass(CLASS_NAME_FADE$3)) {
        const transitionDuration = Util.getTransitionDurationFromElement(tip);

        $__default['default'](tip)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }

      this._hoverState = '';
    }

    update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }

    // Protected

    isWithContent() {
      return Boolean(this.getTitle())
    }

    addAttachmentClass(attachment) {
      $__default['default'](this.getTipElement()).addClass(`${CLASS_PREFIX$1}-${attachment}`);
    }

    getTipElement() {
      this.tip = this.tip || $__default['default'](this.config.template)[0];
      return this.tip
    }

    setContent() {
      const tip = this.getTipElement();
      this.setElementContent($__default['default'](tip.querySelectorAll(SELECTOR_TOOLTIP_INNER)), this.getTitle());
      $__default['default'](tip).removeClass(`${CLASS_NAME_FADE$3} ${CLASS_NAME_SHOW$3}`);
    }

    setElementContent($element, content) {
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (this.config.html) {
          if (!$__default['default'](content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($__default['default'](content).text());
        }

        return
      }

      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
        }

        $element.html(content);
      } else {
        $element.text(content);
      }
    }

    getTitle() {
      let title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ?
          this.config.title.call(this.element) :
          this.config.title;
      }

      return title
    }

    // Private

    _getPopperConfig(attachment) {
      const defaultBsConfig = {
        placement: attachment,
        modifiers: {
          offset: this._getOffset(),
          flip: {
            behavior: this.config.fallbackPlacement
          },
          arrow: {
            element: SELECTOR_ARROW
          },
          preventOverflow: {
            boundariesElement: this.config.boundary
          }
        },
        onCreate: data => {
          if (data.originalPlacement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        },
        onUpdate: data => this._handlePopperPlacementChange(data)
      };

      return {
        ...defaultBsConfig,
        ...this.config.popperConfig
      }
    }

    _getOffset() {
      const offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = data => {
          data.offsets = {
            ...data.offsets,
            ...(this.config.offset(data.offsets, this.element) || {})
          };

          return data
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset
    }

    _getContainer() {
      if (this.config.container === false) {
        return document.body
      }

      if (Util.isElement(this.config.container)) {
        return $__default['default'](this.config.container)
      }

      return $__default['default'](document).find(this.config.container)
    }

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()]
    }

    _setListeners() {
      const triggers = this.config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          $__default['default'](this.element).on(
            this.constructor.Event.CLICK,
            this.config.selector,
            event => this.toggle(event)
          );
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ?
            this.constructor.Event.MOUSEENTER :
            this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ?
            this.constructor.Event.MOUSELEAVE :
            this.constructor.Event.FOCUSOUT;

          $__default['default'](this.element)
            .on(eventIn, this.config.selector, event => this._enter(event))
            .on(eventOut, this.config.selector, event => this._leave(event));
        }
      });

      this._hideModalHandler = () => {
        if (this.element) {
          this.hide();
        }
      };

      $__default['default'](this.element).closest('.modal').on('hide.bs.modal', this._hideModalHandler);

      if (this.config.selector) {
        this.config = {
          ...this.config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }

    _fixTitle() {
      const titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute(
          'data-original-title',
          this.element.getAttribute('title') || ''
        );

        this.element.setAttribute('title', '');
      }
    }

    _enter(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context = context || $__default['default'](event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        );
        $__default['default'](event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[
          event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER
        ] = true;
      }

      if ($__default['default'](context.getTipElement()).hasClass(CLASS_NAME_SHOW$3) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return
      }

      clearTimeout(context._timeout);

      context._hoverState = HOVER_STATE_SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    }

    _leave(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context = context || $__default['default'](event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(
          event.currentTarget,
          this._getDelegateConfig()
        );
        $__default['default'](event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[
          event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER
        ] = false;
      }

      if (context._isWithActiveTrigger()) {
        return
      }

      clearTimeout(context._timeout);

      context._hoverState = HOVER_STATE_OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true
        }
      }

      return false
    }

    _getConfig(config) {
      const dataAttributes = $__default['default'](this.element).data();

      Object.keys(dataAttributes)
        .forEach(dataAttr => {
          if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
            delete dataAttributes[dataAttr];
          }
        });

      config = {
        ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(
        NAME$4,
        config,
        this.constructor.DefaultType
      );

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
      }

      return config
    }

    _getDelegateConfig() {
      const config = {};

      if (this.config) {
        for (const key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config
    }

    _cleanTipClass() {
      const $tip = $__default['default'](this.getTipElement());
      const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);
      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    }

    _handlePopperPlacementChange(popperData) {
      this.tip = popperData.instance.popper;
      this._cleanTipClass();
      this.addAttachmentClass(this._getAttachment(popperData.placement));
    }

    _fixTransition() {
      const tip = this.getTipElement();
      const initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return
      }

      $__default['default'](tip).removeClass(CLASS_NAME_FADE$3);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $__default['default'](this);
        let data = $element.data(DATA_KEY$4);
        const _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $element.data(DATA_KEY$4, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config]();
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$4] = Tooltip._jQueryInterface;
  $__default['default'].fn[NAME$4].Constructor = Tooltip;
  $__default['default'].fn[NAME$4].noConflict = () => {
    $__default['default'].fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Tooltip._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$3 = 'popover';
  const VERSION$3 = '4.6.0';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const JQUERY_NO_CONFLICT$3 = $__default['default'].fn[NAME$3];
  const CLASS_PREFIX = 'bs-popover';
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');

  const Default$2 = {
    ...Tooltip.Default,
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' +
                '<div class="arrow"></div>' +
                '<h3 class="popover-header"></h3>' +
                '<div class="popover-body"></div></div>'
  };

  const DefaultType$2 = {
    ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };

  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_SHOW$2 = 'show';

  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';

  const Event = {
    HIDE: `hide${EVENT_KEY$3}`,
    HIDDEN: `hidden${EVENT_KEY$3}`,
    SHOW: `show${EVENT_KEY$3}`,
    SHOWN: `shown${EVENT_KEY$3}`,
    INSERTED: `inserted${EVENT_KEY$3}`,
    CLICK: `click${EVENT_KEY$3}`,
    FOCUSIN: `focusin${EVENT_KEY$3}`,
    FOCUSOUT: `focusout${EVENT_KEY$3}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {
    // Getters

    static get VERSION() {
      return VERSION$3
    }

    static get Default() {
      return Default$2
    }

    static get NAME() {
      return NAME$3
    }

    static get DATA_KEY() {
      return DATA_KEY$3
    }

    static get Event() {
      return Event
    }

    static get EVENT_KEY() {
      return EVENT_KEY$3
    }

    static get DefaultType() {
      return DefaultType$2
    }

    // Overrides

    isWithContent() {
      return this.getTitle() || this._getContent()
    }

    addAttachmentClass(attachment) {
      $__default['default'](this.getTipElement()).addClass(`${CLASS_PREFIX}-${attachment}`);
    }

    getTipElement() {
      this.tip = this.tip || $__default['default'](this.config.template)[0];
      return this.tip
    }

    setContent() {
      const $tip = $__default['default'](this.getTipElement());

      // We use append for html objects to maintain js events
      this.setElementContent($tip.find(SELECTOR_TITLE), this.getTitle());
      let content = this._getContent();
      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(SELECTOR_CONTENT), content);

      $tip.removeClass(`${CLASS_NAME_FADE$2} ${CLASS_NAME_SHOW$2}`);
    }

    // Private

    _getContent() {
      return this.element.getAttribute('data-content') ||
        this.config.content
    }

    _cleanTipClass() {
      const $tip = $__default['default'](this.getTipElement());
      const tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);
      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $__default['default'](this).data(DATA_KEY$3);
        const _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return
        }

        if (!data) {
          data = new Popover(this, _config);
          $__default['default'](this).data(DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config]();
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$3] = Popover._jQueryInterface;
  $__default['default'].fn[NAME$3].Constructor = Popover;
  $__default['default'].fn[NAME$3].noConflict = () => {
    $__default['default'].fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Popover._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$2 = 'scrollspy';
  const VERSION$2 = '4.6.0';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY$1 = '.data-api';
  const JQUERY_NO_CONFLICT$2 = $__default['default'].fn[NAME$2];

  const Default$1 = {
    offset: 10,
    method: 'auto',
    target: ''
  };

  const DefaultType$1 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };

  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;

  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';

  const SELECTOR_DATA_SPY = '[data-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  const SELECTOR_DROPDOWN_ITEMS = '.dropdown-item';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';

  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy {
    constructor(element, config) {
      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS},` +
                            `${this._config.target} ${SELECTOR_LIST_ITEMS},` +
                            `${this._config.target} ${SELECTOR_DROPDOWN_ITEMS}`;
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;

      $__default['default'](this._scrollElement).on(EVENT_SCROLL, event => this._process(event));

      this.refresh();
      this._process();
    }

    // Getters

    static get VERSION() {
      return VERSION$2
    }

    static get Default() {
      return Default$1
    }

    // Public

    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ?
        METHOD_OFFSET : METHOD_POSITION;

      const offsetMethod = this._config.method === 'auto' ?
        autoMethod : this._config.method;

      const offsetBase = offsetMethod === METHOD_POSITION ?
        this._getScrollTop() : 0;

      this._offsets = [];
      this._targets = [];

      this._scrollHeight = this._getScrollHeight();

      const targets = [].slice.call(document.querySelectorAll(this._selector));

      targets
        .map(element => {
          let target;
          const targetSelector = Util.getSelectorFromElement(element);

          if (targetSelector) {
            target = document.querySelector(targetSelector);
          }

          if (target) {
            const targetBCR = target.getBoundingClientRect();
            if (targetBCR.width || targetBCR.height) {
              // TODO (fat): remove sketch reliance on jQuery position/offset
              return [
                $__default['default'](target)[offsetMethod]().top + offsetBase,
                targetSelector
              ]
            }
          }

          return null
        })
        .filter(item => item)
        .sort((a, b) => a[0] - b[0])
        .forEach(item => {
          this._offsets.push(item[0]);
          this._targets.push(item[1]);
        });
    }

    dispose() {
      $__default['default'].removeData(this._element, DATA_KEY$2);
      $__default['default'](this._scrollElement).off(EVENT_KEY$2);

      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default$1,
        ...(typeof config === 'object' && config ? config : {})
      };

      if (typeof config.target !== 'string' && Util.isElement(config.target)) {
        let id = $__default['default'](config.target).attr('id');
        if (!id) {
          id = Util.getUID(NAME$2);
          $__default['default'](config.target).attr('id', id);
        }

        config.target = `#${id}`;
      }

      Util.typeCheckConfig(NAME$2, config, DefaultType$1);

      return config
    }

    _getScrollTop() {
      return this._scrollElement === window ?
        this._scrollElement.pageYOffset : this._scrollElement.scrollTop
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
    }

    _getOffsetHeight() {
      return this._scrollElement === window ?
        window.innerHeight : this._scrollElement.getBoundingClientRect().height
    }

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;
      const scrollHeight = this._getScrollHeight();
      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;
        this._clear();
        return
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] &&
            scrollTop >= this._offsets[i] &&
            (typeof this._offsets[i + 1] === 'undefined' ||
                scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }

    _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = this._selector
        .split(',')
        .map(selector => `${selector}[data-target="${target}"],${selector}[href="${target}"]`);

      const $link = $__default['default']([].slice.call(document.querySelectorAll(queries.join(','))));

      if ($link.hasClass(CLASS_NAME_DROPDOWN_ITEM)) {
        $link.closest(SELECTOR_DROPDOWN$1)
          .find(SELECTOR_DROPDOWN_TOGGLE$1)
          .addClass(CLASS_NAME_ACTIVE$1);
        $link.addClass(CLASS_NAME_ACTIVE$1);
      } else {
        // Set triggered link as active
        $link.addClass(CLASS_NAME_ACTIVE$1);
        // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
        $link.parents(SELECTOR_NAV_LIST_GROUP$1)
          .prev(`${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`)
          .addClass(CLASS_NAME_ACTIVE$1);
        // Handle special case when .nav-link is inside .nav-item
        $link.parents(SELECTOR_NAV_LIST_GROUP$1)
          .prev(SELECTOR_NAV_ITEMS)
          .children(SELECTOR_NAV_LINKS)
          .addClass(CLASS_NAME_ACTIVE$1);
      }

      $__default['default'](this._scrollElement).trigger(EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }

    _clear() {
      [].slice.call(document.querySelectorAll(this._selector))
        .filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1))
        .forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $__default['default'](this).data(DATA_KEY$2);
        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $__default['default'](this).data(DATA_KEY$2, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config]();
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](window).on(EVENT_LOAD_DATA_API, () => {
    const scrollSpys = [].slice.call(document.querySelectorAll(SELECTOR_DATA_SPY));
    const scrollSpysLength = scrollSpys.length;

    for (let i = scrollSpysLength; i--;) {
      const $spy = $__default['default'](scrollSpys[i]);
      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$2] = ScrollSpy._jQueryInterface;
  $__default['default'].fn[NAME$2].Constructor = ScrollSpy;
  $__default['default'].fn[NAME$2].noConflict = () => {
    $__default['default'].fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return ScrollSpy._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$1 = 'tab';
  const VERSION$1 = '4.6.0';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const DATA_API_KEY = '.data-api';
  const JQUERY_NO_CONFLICT$1 = $__default['default'].fn[NAME$1];

  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;

  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_DISABLED = 'disabled';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';

  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = '> li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab {
    constructor(element) {
      this._element = element;
    }

    // Getters

    static get VERSION() {
      return VERSION$1
    }

    // Public

    show() {
      if (this._element.parentNode &&
          this._element.parentNode.nodeType === Node.ELEMENT_NODE &&
          $__default['default'](this._element).hasClass(CLASS_NAME_ACTIVE) ||
          $__default['default'](this._element).hasClass(CLASS_NAME_DISABLED)) {
        return
      }

      let target;
      let previous;
      const listElement = $__default['default'](this._element).closest(SELECTOR_NAV_LIST_GROUP)[0];
      const selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = $__default['default'].makeArray($__default['default'](listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      const hideEvent = $__default['default'].Event(EVENT_HIDE$1, {
        relatedTarget: this._element
      });

      const showEvent = $__default['default'].Event(EVENT_SHOW$1, {
        relatedTarget: previous
      });

      if (previous) {
        $__default['default'](previous).trigger(hideEvent);
      }

      $__default['default'](this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() ||
          hideEvent.isDefaultPrevented()) {
        return
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this._activate(
        this._element,
        listElement
      );

      const complete = () => {
        const hiddenEvent = $__default['default'].Event(EVENT_HIDDEN$1, {
          relatedTarget: this._element
        });

        const shownEvent = $__default['default'].Event(EVENT_SHOWN$1, {
          relatedTarget: previous
        });

        $__default['default'](previous).trigger(hiddenEvent);
        $__default['default'](this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    }

    dispose() {
      $__default['default'].removeData(this._element, DATA_KEY$1);
      this._element = null;
    }

    // Private

    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ?
        $__default['default'](container).find(SELECTOR_ACTIVE_UL) :
        $__default['default'](container).children(SELECTOR_ACTIVE);

      const active = activeElements[0];
      const isTransitioning = callback && (active && $__default['default'](active).hasClass(CLASS_NAME_FADE$1));
      const complete = () => this._transitionComplete(
        element,
        active,
        callback
      );

      if (active && isTransitioning) {
        const transitionDuration = Util.getTransitionDurationFromElement(active);

        $__default['default'](active)
          .removeClass(CLASS_NAME_SHOW$1)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }

    _transitionComplete(element, active, callback) {
      if (active) {
        $__default['default'](active).removeClass(CLASS_NAME_ACTIVE);

        const dropdownChild = $__default['default'](active.parentNode).find(
          SELECTOR_DROPDOWN_ACTIVE_CHILD
        )[0];

        if (dropdownChild) {
          $__default['default'](dropdownChild).removeClass(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $__default['default'](element).addClass(CLASS_NAME_ACTIVE);
      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
      }

      if (element.parentNode && $__default['default'](element.parentNode).hasClass(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = $__default['default'](element).closest(SELECTOR_DROPDOWN)[0];

        if (dropdownElement) {
          const dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(SELECTOR_DROPDOWN_TOGGLE));

          $__default['default'](dropdownToggleList).addClass(CLASS_NAME_ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $this = $__default['default'](this);
        let data = $this.data(DATA_KEY$1);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$1, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config]();
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */

  $__default['default'](document)
    .on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
      event.preventDefault();
      Tab._jQueryInterface.call($__default['default'](this), 'show');
    });

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME$1] = Tab._jQueryInterface;
  $__default['default'].fn[NAME$1].Constructor = Tab;
  $__default['default'].fn[NAME$1].noConflict = () => {
    $__default['default'].fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Tab._jQueryInterface
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.0): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const VERSION = '4.6.0';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const JQUERY_NO_CONFLICT = $__default['default'].fn[NAME];

  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;

  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';

  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };

  const Default = {
    animation: true,
    autohide: true,
    delay: 500
  };

  const SELECTOR_DATA_DISMISS = '[data-dismiss="toast"]';

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast {
    constructor(element, config) {
      this._element = element;
      this._config = this._getConfig(config);
      this._timeout = null;
      this._setListeners();
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    static get DefaultType() {
      return DefaultType
    }

    static get Default() {
      return Default
    }

    // Public

    show() {
      const showEvent = $__default['default'].Event(EVENT_SHOW);

      $__default['default'](this._element).trigger(showEvent);
      if (showEvent.isDefaultPrevented()) {
        return
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);
        this._element.classList.add(CLASS_NAME_SHOW);

        $__default['default'](this._element).trigger(EVENT_SHOWN);

        if (this._config.autohide) {
          this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay);
        }
      };

      this._element.classList.remove(CLASS_NAME_HIDE);
      Util.reflow(this._element);
      this._element.classList.add(CLASS_NAME_SHOWING);
      if (this._config.animation) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._element);

        $__default['default'](this._element)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return
      }

      const hideEvent = $__default['default'].Event(EVENT_HIDE);

      $__default['default'](this._element).trigger(hideEvent);
      if (hideEvent.isDefaultPrevented()) {
        return
      }

      this._close();
    }

    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      $__default['default'](this._element).off(EVENT_CLICK_DISMISS);

      $__default['default'].removeData(this._element, DATA_KEY);
      this._element = null;
      this._config = null;
    }

    // Private

    _getConfig(config) {
      config = {
        ...Default,
        ...$__default['default'](this._element).data(),
        ...(typeof config === 'object' && config ? config : {})
      };

      Util.typeCheckConfig(
        NAME,
        config,
        this.constructor.DefaultType
      );

      return config
    }

    _setListeners() {
      $__default['default'](this._element).on(EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide());
    }

    _close() {
      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE);
        $__default['default'](this._element).trigger(EVENT_HIDDEN);
      };

      this._element.classList.remove(CLASS_NAME_SHOW);
      if (this._config.animation) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._element);

        $__default['default'](this._element)
          .one(Util.TRANSITION_END, complete)
          .emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }

    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $__default['default'](this);
        let data = $element.data(DATA_KEY);
        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
          $element.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`)
          }

          data[config](this);
        }
      })
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $__default['default'].fn[NAME] = Toast._jQueryInterface;
  $__default['default'].fn[NAME].Constructor = Toast;
  $__default['default'].fn[NAME].noConflict = () => {
    $__default['default'].fn[NAME] = JQUERY_NO_CONFLICT;
    return Toast._jQueryInterface
  };

  /**
   * File skip-link-focus-fix.js.
   *
   * Helps with accessibility for keyboard only users.
   *
   * Learn more: https://git.io/vWdr2
   */
  (function () {
    var isWebkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1,
        isOpera = navigator.userAgent.toLowerCase().indexOf('opera') > -1,
        isIe = navigator.userAgent.toLowerCase().indexOf('msie') > -1;

    if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
      window.addEventListener('hashchange', function () {
        var id = location.hash.substring(1),
            element;

        if (!/^[A-z0-9_-]+$/.test(id)) {
          return;
        }

        element = document.getElementById(id);

        if (element) {
          if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
            element.tabIndex = -1;
          }

          element.focus();
        }
      }, false);
    }
  })();

  /*! UIkit 3.8.1 | https://www.getuikit.com | (c) 2014 - 2021 YOOtheme | MIT License */
  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define('uikit', factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UIkit = factory());
  })(undefined, function () {

    var objPrototype = Object.prototype;
    var hasOwnProperty = objPrototype.hasOwnProperty;

    function hasOwn(obj, key) {
      return hasOwnProperty.call(obj, key);
    }

    var hyphenateRe = /\B([A-Z])/g;
    var hyphenate = memoize(function (str) {
      return str.replace(hyphenateRe, '-$1').toLowerCase();
    });
    var camelizeRe = /-(\w)/g;
    var camelize = memoize(function (str) {
      return str.replace(camelizeRe, toUpper);
    });
    var ucfirst = memoize(function (str) {
      return str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '';
    });

    function toUpper(_, c) {
      return c ? c.toUpperCase() : '';
    }

    var strPrototype = String.prototype;

    var startsWithFn = strPrototype.startsWith || function (search) {
      return this.lastIndexOf(search, 0) === 0;
    };

    function startsWith(str, search) {
      return startsWithFn.call(str, search);
    }

    var endsWithFn = strPrototype.endsWith || function (search) {
      return this.substr(-search.length) === search;
    };

    function endsWith(str, search) {
      return endsWithFn.call(str, search);
    }

    var arrPrototype = Array.prototype;

    var includesFn = function (search, i) {
      return !!~this.indexOf(search, i);
    };

    var includesStr = strPrototype.includes || includesFn;
    var includesArray = arrPrototype.includes || includesFn;

    function includes(obj, search) {
      return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
    }

    var findIndexFn = arrPrototype.findIndex || function (predicate) {
      var arguments$1 = arguments;

      for (var i = 0; i < this.length; i++) {
        if (predicate.call(arguments$1[1], this[i], i, this)) {
          return i;
        }
      }

      return -1;
    };

    function findIndex(array, predicate) {
      return findIndexFn.call(array, predicate);
    }

    var isArray = Array.isArray;

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    function isObject(obj) {
      return obj !== null && typeof obj === 'object';
    }

    var toString = objPrototype.toString;

    function isPlainObject(obj) {
      return toString.call(obj) === '[object Object]';
    }

    function isWindow(obj) {
      return isObject(obj) && obj === obj.window;
    }

    function isDocument(obj) {
      return nodeType(obj) === 9;
    }

    function isNode(obj) {
      return nodeType(obj) >= 1;
    }

    function isElement(obj) {
      return nodeType(obj) === 1;
    }

    function nodeType(obj) {
      return !isWindow(obj) && isObject(obj) && obj.nodeType;
    }

    function isBoolean(value) {
      return typeof value === 'boolean';
    }

    function isString(value) {
      return typeof value === 'string';
    }

    function isNumber(value) {
      return typeof value === 'number';
    }

    function isNumeric(value) {
      return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
    }

    function isEmpty(obj) {
      return !(isArray(obj) ? obj.length : isObject(obj) ? Object.keys(obj).length : false);
    }

    function isUndefined(value) {
      return value === void 0;
    }

    function toBoolean(value) {
      return isBoolean(value) ? value : value === 'true' || value === '1' || value === '' ? true : value === 'false' || value === '0' ? false : value;
    }

    function toNumber(value) {
      var number = Number(value);
      return !isNaN(number) ? number : false;
    }

    function toFloat(value) {
      return parseFloat(value) || 0;
    }

    var toArray = Array.from || function (value) {
      return arrPrototype.slice.call(value);
    };

    function toNode(element) {
      return toNodes(element)[0];
    }

    function toNodes(element) {
      return element && (isNode(element) ? [element] : toArray(element).filter(isNode)) || [];
    }

    function toWindow(element) {
      if (isWindow(element)) {
        return element;
      }

      element = toNode(element);
      return element ? (isDocument(element) ? element : element.ownerDocument).defaultView : window;
    }

    function toMs(time) {
      return !time ? 0 : endsWith(time, 'ms') ? toFloat(time) : toFloat(time) * 1000;
    }

    function isEqual(value, other) {
      return value === other || isObject(value) && isObject(other) && Object.keys(value).length === Object.keys(other).length && each(value, function (val, key) {
        return val === other[key];
      });
    }

    function swap(value, a, b) {
      return value.replace(new RegExp(a + "|" + b, 'g'), function (match) {
        return match === a ? b : a;
      });
    }

    var assign = Object.assign || function (target) {
      var args = [],
          len = arguments.length - 1;

      while (len-- > 0) args[len] = arguments[len + 1];

      target = Object(target);

      for (var i = 0; i < args.length; i++) {
        var source = args[i];

        if (source !== null) {
          for (var key in source) {
            if (hasOwn(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }

      return target;
    };

    function last(array) {
      return array[array.length - 1];
    }

    function each(obj, cb) {
      for (var key in obj) {
        if (false === cb(obj[key], key)) {
          return false;
        }
      }

      return true;
    }

    function sortBy$1(array, prop) {
      return array.slice().sort(function (ref, ref$1) {
        var propA = ref[prop];
        if (propA === void 0) propA = 0;
        var propB = ref$1[prop];
        if (propB === void 0) propB = 0;
        return propA > propB ? 1 : propB > propA ? -1 : 0;
      });
    }

    function uniqueBy(array, prop) {
      var seen = new Set();
      return array.filter(function (ref) {
        var check = ref[prop];
        return seen.has(check) ? false : seen.add(check) || true;
      } // IE 11 does not return the Set object
      );
    }

    function clamp(number, min, max) {
      if (min === void 0) min = 0;
      if (max === void 0) max = 1;
      return Math.min(Math.max(toNumber(number) || 0, min), max);
    }

    function noop() {}

    function intersectRect() {
      var rects = [],
          len = arguments.length;

      while (len--) rects[len] = arguments[len];

      return [['bottom', 'top'], ['right', 'left']].every(function (ref) {
        var minProp = ref[0];
        var maxProp = ref[1];
        return Math.min.apply(Math, rects.map(function (ref) {
          var min = ref[minProp];
          return min;
        })) - Math.max.apply(Math, rects.map(function (ref) {
          var max = ref[maxProp];
          return max;
        })) > 0;
      });
    }

    function pointInRect(point, rect) {
      return point.x <= rect.right && point.x >= rect.left && point.y <= rect.bottom && point.y >= rect.top;
    }

    var Dimensions = {
      ratio: function (dimensions, prop, value) {
        var obj;
        var aProp = prop === 'width' ? 'height' : 'width';
        return obj = {}, obj[aProp] = dimensions[prop] ? Math.round(value * dimensions[aProp] / dimensions[prop]) : dimensions[aProp], obj[prop] = value, obj;
      },
      contain: function (dimensions, maxDimensions) {
        var this$1$1 = this;
        dimensions = assign({}, dimensions);
        each(dimensions, function (_, prop) {
          return dimensions = dimensions[prop] > maxDimensions[prop] ? this$1$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions;
        });
        return dimensions;
      },
      cover: function (dimensions, maxDimensions) {
        var this$1$1 = this;
        dimensions = this.contain(dimensions, maxDimensions);
        each(dimensions, function (_, prop) {
          return dimensions = dimensions[prop] < maxDimensions[prop] ? this$1$1.ratio(dimensions, prop, maxDimensions[prop]) : dimensions;
        });
        return dimensions;
      }
    };

    function getIndex(i, elements, current, finite) {
      if (current === void 0) current = 0;
      if (finite === void 0) finite = false;
      elements = toNodes(elements);
      var length = elements.length;
      i = isNumeric(i) ? toNumber(i) : i === 'next' ? current + 1 : i === 'previous' ? current - 1 : elements.indexOf(toNode(i));

      if (finite) {
        return clamp(i, 0, length - 1);
      }

      i %= length;
      return i < 0 ? i + length : i;
    }

    function memoize(fn) {
      var cache = Object.create(null);
      return function (key) {
        return cache[key] || (cache[key] = fn(key));
      };
    }

    function attr(element, name, value) {
      if (isObject(name)) {
        for (var key in name) {
          attr(element, key, name[key]);
        }

        return;
      }

      if (isUndefined(value)) {
        element = toNode(element);
        return element && element.getAttribute(name);
      } else {
        toNodes(element).forEach(function (element) {
          if (isFunction(value)) {
            value = value.call(element, attr(element, name));
          }

          if (value === null) {
            removeAttr(element, name);
          } else {
            element.setAttribute(name, value);
          }
        });
      }
    }

    function hasAttr(element, name) {
      return toNodes(element).some(function (element) {
        return element.hasAttribute(name);
      });
    }

    function removeAttr(element, name) {
      element = toNodes(element);
      name.split(' ').forEach(function (name) {
        return element.forEach(function (element) {
          return element.hasAttribute(name) && element.removeAttribute(name);
        });
      });
    }

    function data(element, attribute) {
      for (var i = 0, attrs = [attribute, "data-" + attribute]; i < attrs.length; i++) {
        if (hasAttr(element, attrs[i])) {
          return attr(element, attrs[i]);
        }
      }
    }
    /* global DocumentTouch */


    var inBrowser = typeof window !== 'undefined';
    var isIE = inBrowser && /msie|trident/i.test(window.navigator.userAgent);
    var isRtl = inBrowser && attr(document.documentElement, 'dir') === 'rtl';
    var hasTouchEvents = inBrowser && 'ontouchstart' in window;
    var hasPointerEvents = inBrowser && window.PointerEvent;
    var hasTouch = inBrowser && (hasTouchEvents || window.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints); // IE >=11

    var pointerDown = hasPointerEvents ? 'pointerdown' : hasTouchEvents ? 'touchstart' : 'mousedown';
    var pointerMove = hasPointerEvents ? 'pointermove' : hasTouchEvents ? 'touchmove' : 'mousemove';
    var pointerUp = hasPointerEvents ? 'pointerup' : hasTouchEvents ? 'touchend' : 'mouseup';
    var pointerEnter = hasPointerEvents ? 'pointerenter' : hasTouchEvents ? '' : 'mouseenter';
    var pointerLeave = hasPointerEvents ? 'pointerleave' : hasTouchEvents ? '' : 'mouseleave';
    var pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';
    var voidElements = {
      area: true,
      base: true,
      br: true,
      col: true,
      embed: true,
      hr: true,
      img: true,
      input: true,
      keygen: true,
      link: true,
      menuitem: true,
      meta: true,
      param: true,
      source: true,
      track: true,
      wbr: true
    };

    function isVoidElement(element) {
      return toNodes(element).some(function (element) {
        return voidElements[element.tagName.toLowerCase()];
      });
    }

    function isVisible(element) {
      return toNodes(element).some(function (element) {
        return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
      });
    }

    var selInput = 'input,select,textarea,button';

    function isInput(element) {
      return toNodes(element).some(function (element) {
        return matches(element, selInput);
      });
    }

    var selFocusable = selInput + ",a[href],[tabindex]";

    function isFocusable(element) {
      return matches(element, selFocusable);
    }

    function parent(element) {
      element = toNode(element);
      return element && isElement(element.parentNode) && element.parentNode;
    }

    function filter$1(element, selector) {
      return toNodes(element).filter(function (element) {
        return matches(element, selector);
      });
    }

    var elProto = inBrowser ? Element.prototype : {};
    var matchesFn = elProto.matches || elProto.webkitMatchesSelector || elProto.msMatchesSelector || noop;

    function matches(element, selector) {
      return toNodes(element).some(function (element) {
        return matchesFn.call(element, selector);
      });
    }

    var closestFn = elProto.closest || function (selector) {
      var ancestor = this;

      do {
        if (matches(ancestor, selector)) {
          return ancestor;
        }
      } while (ancestor = parent(ancestor));
    };

    function closest(element, selector) {
      if (startsWith(selector, '>')) {
        selector = selector.slice(1);
      }

      return isElement(element) ? closestFn.call(element, selector) : toNodes(element).map(function (element) {
        return closest(element, selector);
      }).filter(Boolean);
    }

    function within(element, selector) {
      return !isString(selector) ? element === selector || (isDocument(selector) ? selector.documentElement : toNode(selector)).contains(toNode(element)) // IE 11 document does not implement contains
      : matches(element, selector) || !!closest(element, selector);
    }

    function parents(element, selector) {
      var elements = [];

      while (element = parent(element)) {
        if (!selector || matches(element, selector)) {
          elements.push(element);
        }
      }

      return elements;
    }

    function children(element, selector) {
      element = toNode(element);
      var children = element ? toNodes(element.children) : [];
      return selector ? filter$1(children, selector) : children;
    }

    function index(element, ref) {
      return ref ? toNodes(element).indexOf(toNode(ref)) : children(parent(element)).indexOf(element);
    }

    function query(selector, context) {
      return find(selector, getContext(selector, context));
    }

    function queryAll(selector, context) {
      return findAll(selector, getContext(selector, context));
    }

    function getContext(selector, context) {
      if (context === void 0) context = document;
      return isString(selector) && isContextSelector(selector) || isDocument(context) ? context : context.ownerDocument;
    }

    function find(selector, context) {
      return toNode(_query(selector, context, 'querySelector'));
    }

    function findAll(selector, context) {
      return toNodes(_query(selector, context, 'querySelectorAll'));
    }

    function _query(selector, context, queryFn) {
      if (context === void 0) context = document;

      if (!selector || !isString(selector)) {
        return selector;
      }

      selector = selector.replace(contextSanitizeRe, '$1 *');

      if (isContextSelector(selector)) {
        selector = splitSelector(selector).map(function (selector) {
          var ctx = context;

          if (selector[0] === '!') {
            var selectors = selector.substr(1).trim().split(' ');
            ctx = closest(parent(context), selectors[0]);
            selector = selectors.slice(1).join(' ').trim();
          }

          if (selector[0] === '-') {
            var selectors$1 = selector.substr(1).trim().split(' ');
            var prev = (ctx || context).previousElementSibling;
            ctx = matches(prev, selector.substr(1)) ? prev : null;
            selector = selectors$1.slice(1).join(' ');
          }

          if (!ctx) {
            return null;
          }

          return domPath(ctx) + " " + selector;
        }).filter(Boolean).join(',');
        context = document;
      }

      try {
        return context[queryFn](selector);
      } catch (e) {
        return null;
      }
    }

    var contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
    var contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
    var isContextSelector = memoize(function (selector) {
      return selector.match(contextSelectorRe);
    });
    var selectorRe = /.*?[^\\](?:,|$)/g;
    var splitSelector = memoize(function (selector) {
      return selector.match(selectorRe).map(function (selector) {
        return selector.replace(/,$/, '').trim();
      });
    });

    function domPath(element) {
      var names = [];

      while (element.parentNode) {
        if (element.id) {
          names.unshift("#" + escape(element.id));
          break;
        } else {
          var tagName = element.tagName;

          if (tagName !== 'HTML') {
            tagName += ":nth-child(" + (index(element) + 1) + ")";
          }

          names.unshift(tagName);
          element = element.parentNode;
        }
      }

      return names.join(' > ');
    }

    var escapeFn = inBrowser && window.CSS && CSS.escape || function (css) {
      return css.replace(/([^\x7f-\uFFFF\w-])/g, function (match) {
        return "\\" + match;
      });
    };

    function escape(css) {
      return isString(css) ? escapeFn.call(null, css) : '';
    }

    function on() {
      var args = [],
          len = arguments.length;

      while (len--) args[len] = arguments[len];

      var ref = getArgs(args);
      var targets = ref[0];
      var type = ref[1];
      var selector = ref[2];
      var listener = ref[3];
      var useCapture = ref[4];
      targets = toEventTargets(targets);

      if (listener.length > 1) {
        listener = detail(listener);
      }

      if (useCapture && useCapture.self) {
        listener = selfFilter(listener);
      }

      if (selector) {
        listener = delegate(selector, listener);
      }

      useCapture = useCaptureFilter(useCapture);
      type.split(' ').forEach(function (type) {
        return targets.forEach(function (target) {
          return target.addEventListener(type, listener, useCapture);
        });
      });
      return function () {
        return off(targets, type, listener, useCapture);
      };
    }

    function off(targets, type, listener, useCapture) {
      if (useCapture === void 0) useCapture = false;
      useCapture = useCaptureFilter(useCapture);
      targets = toEventTargets(targets);
      type.split(' ').forEach(function (type) {
        return targets.forEach(function (target) {
          return target.removeEventListener(type, listener, useCapture);
        });
      });
    }

    function once() {
      var args = [],
          len = arguments.length;

      while (len--) args[len] = arguments[len];

      var ref = getArgs(args);
      var element = ref[0];
      var type = ref[1];
      var selector = ref[2];
      var listener = ref[3];
      var useCapture = ref[4];
      var condition = ref[5];
      var off = on(element, type, selector, function (e) {
        var result = !condition || condition(e);

        if (result) {
          off();
          listener(e, result);
        }
      }, useCapture);
      return off;
    }

    function trigger(targets, event, detail) {
      return toEventTargets(targets).reduce(function (notCanceled, target) {
        return notCanceled && target.dispatchEvent(createEvent(event, true, true, detail));
      }, true);
    }

    function createEvent(e, bubbles, cancelable, detail) {
      if (bubbles === void 0) bubbles = true;
      if (cancelable === void 0) cancelable = false;

      if (isString(e)) {
        var event = document.createEvent('CustomEvent'); // IE 11

        event.initCustomEvent(e, bubbles, cancelable, detail);
        e = event;
      }

      return e;
    }

    function getArgs(args) {
      if (isFunction(args[2])) {
        args.splice(2, 0, false);
      }

      return args;
    }

    function delegate(selector, listener) {
      var this$1$1 = this;
      return function (e) {
        var current = selector[0] === '>' ? findAll(selector, e.currentTarget).reverse().filter(function (element) {
          return within(e.target, element);
        })[0] : closest(e.target, selector);

        if (current) {
          e.current = current;
          listener.call(this$1$1, e);
        }
      };
    }

    function detail(listener) {
      return function (e) {
        return isArray(e.detail) ? listener.apply(void 0, [e].concat(e.detail)) : listener(e);
      };
    }

    function selfFilter(listener) {
      return function (e) {
        if (e.target === e.currentTarget || e.target === e.current) {
          return listener.call(null, e);
        }
      };
    }

    function useCaptureFilter(options) {
      return options && isIE && !isBoolean(options) ? !!options.capture : options;
    }

    function isEventTarget(target) {
      return target && 'addEventListener' in target;
    }

    function toEventTarget(target) {
      return isEventTarget(target) ? target : toNode(target);
    }

    function toEventTargets(target) {
      return isArray(target) ? target.map(toEventTarget).filter(Boolean) : isString(target) ? findAll(target) : isEventTarget(target) ? [target] : toNodes(target);
    }

    function isTouch(e) {
      return e.pointerType === 'touch' || !!e.touches;
    }

    function getEventPos(e) {
      var touches = e.touches;
      var changedTouches = e.changedTouches;
      var ref = touches && touches[0] || changedTouches && changedTouches[0] || e;
      var x = ref.clientX;
      var y = ref.clientY;
      return {
        x: x,
        y: y
      };
    }
    /* global setImmediate */


    var Promise$1 = inBrowser && window.Promise || PromiseFn;

    var Deferred = function () {
      var this$1$1 = this;
      this.promise = new Promise$1(function (resolve, reject) {
        this$1$1.reject = reject;
        this$1$1.resolve = resolve;
      });
    };
    /**
     * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
     */


    var RESOLVED = 0;
    var REJECTED = 1;
    var PENDING = 2;
    var async = inBrowser && window.setImmediate || setTimeout;

    function PromiseFn(executor) {
      this.state = PENDING;
      this.value = undefined;
      this.deferred = [];
      var promise = this;

      try {
        executor(function (x) {
          promise.resolve(x);
        }, function (r) {
          promise.reject(r);
        });
      } catch (e) {
        promise.reject(e);
      }
    }

    PromiseFn.reject = function (r) {
      return new PromiseFn(function (resolve, reject) {
        reject(r);
      });
    };

    PromiseFn.resolve = function (x) {
      return new PromiseFn(function (resolve, reject) {
        resolve(x);
      });
    };

    PromiseFn.all = function all(iterable) {
      return new PromiseFn(function (resolve, reject) {
        var result = [];
        var count = 0;

        if (iterable.length === 0) {
          resolve(result);
        }

        function resolver(i) {
          return function (x) {
            result[i] = x;
            count += 1;

            if (count === iterable.length) {
              resolve(result);
            }
          };
        }

        for (var i = 0; i < iterable.length; i += 1) {
          PromiseFn.resolve(iterable[i]).then(resolver(i), reject);
        }
      });
    };

    PromiseFn.race = function race(iterable) {
      return new PromiseFn(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
          PromiseFn.resolve(iterable[i]).then(resolve, reject);
        }
      });
    };

    var p = PromiseFn.prototype;

    p.resolve = function resolve(x) {
      var promise = this;

      if (promise.state === PENDING) {
        if (x === promise) {
          throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
          var then = x && x.then;

          if (x !== null && isObject(x) && isFunction(then)) {
            then.call(x, function (x) {
              if (!called) {
                promise.resolve(x);
              }

              called = true;
            }, function (r) {
              if (!called) {
                promise.reject(r);
              }

              called = true;
            });
            return;
          }
        } catch (e) {
          if (!called) {
            promise.reject(e);
          }

          return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
      }
    };

    p.reject = function reject(reason) {
      var promise = this;

      if (promise.state === PENDING) {
        if (reason === promise) {
          throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
      }
    };

    p.notify = function notify() {
      var this$1$1 = this;
      async(function () {
        if (this$1$1.state !== PENDING) {
          while (this$1$1.deferred.length) {
            var ref = this$1$1.deferred.shift();
            var onResolved = ref[0];
            var onRejected = ref[1];
            var resolve = ref[2];
            var reject = ref[3];

            try {
              if (this$1$1.state === RESOLVED) {
                if (isFunction(onResolved)) {
                  resolve(onResolved.call(undefined, this$1$1.value));
                } else {
                  resolve(this$1$1.value);
                }
              } else if (this$1$1.state === REJECTED) {
                if (isFunction(onRejected)) {
                  resolve(onRejected.call(undefined, this$1$1.value));
                } else {
                  reject(this$1$1.value);
                }
              }
            } catch (e) {
              reject(e);
            }
          }
        }
      });
    };

    p.then = function then(onResolved, onRejected) {
      var this$1$1 = this;
      return new PromiseFn(function (resolve, reject) {
        this$1$1.deferred.push([onResolved, onRejected, resolve, reject]);
        this$1$1.notify();
      });
    };

    p.catch = function (onRejected) {
      return this.then(undefined, onRejected);
    };

    function ajax(url, options) {
      var env = assign({
        data: null,
        method: 'GET',
        headers: {},
        xhr: new XMLHttpRequest(),
        beforeSend: noop,
        responseType: ''
      }, options);
      return Promise$1.resolve().then(function () {
        return env.beforeSend(env);
      }).then(function () {
        return send(url, env);
      });
    }

    function send(url, env) {
      return new Promise$1(function (resolve, reject) {
        var xhr = env.xhr;

        for (var prop in env) {
          if (prop in xhr) {
            try {
              xhr[prop] = env[prop];
            } catch (e) {}
          }
        }

        xhr.open(env.method.toUpperCase(), url);

        for (var header in env.headers) {
          xhr.setRequestHeader(header, env.headers[header]);
        }

        on(xhr, 'load', function () {
          if (xhr.status === 0 || xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
            // IE 11 does not support responseType 'json'
            if (env.responseType === 'json' && isString(xhr.response)) {
              xhr = assign(copyXhr(xhr), {
                response: JSON.parse(xhr.response)
              });
            }

            resolve(xhr);
          } else {
            reject(assign(Error(xhr.statusText), {
              xhr: xhr,
              status: xhr.status
            }));
          }
        });
        on(xhr, 'error', function () {
          return reject(assign(Error('Network Error'), {
            xhr: xhr
          }));
        });
        on(xhr, 'timeout', function () {
          return reject(assign(Error('Network Timeout'), {
            xhr: xhr
          }));
        });
        xhr.send(env.data);
      });
    }

    function getImage(src, srcset, sizes) {
      return new Promise$1(function (resolve, reject) {
        var img = new Image();

        img.onerror = function (e) {
          return reject(e);
        };

        img.onload = function () {
          return resolve(img);
        };

        sizes && (img.sizes = sizes);
        srcset && (img.srcset = srcset);
        img.src = src;
      });
    }

    function copyXhr(source) {
      var target = {};

      for (var key in source) {
        target[key] = source[key];
      }

      return target;
    }

    function ready(fn) {
      if (document.readyState !== 'loading') {
        fn();
        return;
      }

      var unbind = on(document, 'DOMContentLoaded', function () {
        unbind();
        fn();
      });
    }

    function empty(element) {
      element = $(element);
      element.innerHTML = '';
      return element;
    }

    function html(parent, html) {
      parent = $(parent);
      return isUndefined(html) ? parent.innerHTML : append(parent.hasChildNodes() ? empty(parent) : parent, html);
    }

    function prepend(parent, element) {
      parent = $(parent);

      if (!parent.hasChildNodes()) {
        return append(parent, element);
      } else {
        return insertNodes(element, function (element) {
          return parent.insertBefore(element, parent.firstChild);
        });
      }
    }

    function append(parent, element) {
      parent = $(parent);
      return insertNodes(element, function (element) {
        return parent.appendChild(element);
      });
    }

    function before(ref, element) {
      ref = $(ref);
      return insertNodes(element, function (element) {
        return ref.parentNode.insertBefore(element, ref);
      });
    }

    function after(ref, element) {
      ref = $(ref);
      return insertNodes(element, function (element) {
        return ref.nextSibling ? before(ref.nextSibling, element) : append(ref.parentNode, element);
      });
    }

    function insertNodes(element, fn) {
      element = isString(element) ? fragment(element) : element;
      return element ? 'length' in element ? toNodes(element).map(fn) : fn(element) : null;
    }

    function remove$1(element) {
      toNodes(element).forEach(function (element) {
        return element.parentNode && element.parentNode.removeChild(element);
      });
    }

    function wrapAll(element, structure) {
      structure = toNode(before(element, structure));

      while (structure.firstChild) {
        structure = structure.firstChild;
      }

      append(structure, element);
      return structure;
    }

    function wrapInner(element, structure) {
      return toNodes(toNodes(element).map(function (element) {
        return element.hasChildNodes ? wrapAll(toNodes(element.childNodes), structure) : append(element, structure);
      }));
    }

    function unwrap(element) {
      toNodes(element).map(parent).filter(function (value, index, self) {
        return self.indexOf(value) === index;
      }).forEach(function (parent) {
        before(parent, parent.childNodes);
        remove$1(parent);
      });
    }

    var fragmentRe = /^\s*<(\w+|!)[^>]*>/;
    var singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

    function fragment(html) {
      var matches = singleTagRe.exec(html);

      if (matches) {
        return document.createElement(matches[1]);
      }

      var container = document.createElement('div');

      if (fragmentRe.test(html)) {
        container.insertAdjacentHTML('beforeend', html.trim());
      } else {
        container.textContent = html;
      }

      return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;
    }

    function apply$1(node, fn) {
      if (!isElement(node)) {
        return;
      }

      fn(node);
      node = node.firstElementChild;

      while (node) {
        var next = node.nextElementSibling;
        apply$1(node, fn);
        node = next;
      }
    }

    function $(selector, context) {
      return isHtml(selector) ? toNode(fragment(selector)) : find(selector, context);
    }

    function $$(selector, context) {
      return isHtml(selector) ? toNodes(fragment(selector)) : findAll(selector, context);
    }

    function isHtml(str) {
      return isString(str) && (str[0] === '<' || str.match(/^\s*</));
    }

    function addClass(element) {
      var args = [],
          len = arguments.length - 1;

      while (len-- > 0) args[len] = arguments[len + 1];

      apply(element, args, 'add');
    }

    function removeClass(element) {
      var args = [],
          len = arguments.length - 1;

      while (len-- > 0) args[len] = arguments[len + 1];

      apply(element, args, 'remove');
    }

    function removeClasses(element, cls) {
      attr(element, 'class', function (value) {
        return (value || '').replace(new RegExp("\\b" + cls + "\\b", 'g'), '');
      });
    }

    function replaceClass(element) {
      var args = [],
          len = arguments.length - 1;

      while (len-- > 0) args[len] = arguments[len + 1];

      args[0] && removeClass(element, args[0]);
      args[1] && addClass(element, args[1]);
    }

    function hasClass(element, cls) {
      var assign;
      assign = getClasses(cls), cls = assign[0];
      var nodes = toNodes(element);

      for (var n = 0; n < nodes.length; n++) {
        if (cls && nodes[n].classList.contains(cls)) {
          return true;
        }
      }

      return false;
    }

    function toggleClass(element, cls, force) {
      cls = getClasses(cls);
      var nodes = toNodes(element);

      for (var n = 0; n < nodes.length; n++) {
        var list = nodes[n].classList;

        for (var i = 0; i < cls.length; i++) {
          if (isUndefined(force)) {
            list.toggle(cls[i]);
          } else if (supports.Force) {
            list.toggle(cls[i], !!force);
          } else {
            list[force ? 'add' : 'remove'](cls[i]);
          }
        }
      }
    }

    function apply(element, args, fn) {
      var ref;
      args = args.reduce(function (args, arg) {
        return args.concat(getClasses(arg));
      }, []);
      var nodes = toNodes(element);

      var loop = function (n) {
        if (supports.Multiple) {
          (ref = nodes[n].classList)[fn].apply(ref, args);
        } else {
          args.forEach(function (cls) {
            return nodes[n].classList[fn](cls);
          });
        }
      };

      for (var n = 0; n < nodes.length; n++) loop(n);
    }

    function getClasses(str) {
      return String(str).split(/\s|,/).filter(Boolean);
    } // IE 11


    var supports = {
      get Multiple() {
        return this.get('Multiple');
      },

      get Force() {
        return this.get('Force');
      },

      get: function (key) {
        var ref = document.createElement('_');
        var classList = ref.classList;
        classList.add('a', 'b');
        classList.toggle('c', false);
        supports = {
          Multiple: classList.contains('b'),
          Force: !classList.contains('c')
        };
        return supports[key];
      }
    };
    var cssNumber = {
      'animation-iteration-count': true,
      'column-count': true,
      'fill-opacity': true,
      'flex-grow': true,
      'flex-shrink': true,
      'font-weight': true,
      'line-height': true,
      'opacity': true,
      'order': true,
      'orphans': true,
      'stroke-dasharray': true,
      'stroke-dashoffset': true,
      'widows': true,
      'z-index': true,
      'zoom': true
    };

    function css(element, property, value, priority) {
      if (priority === void 0) priority = '';
      return toNodes(element).map(function (element) {
        if (isString(property)) {
          property = propName(property);

          if (isUndefined(value)) {
            return getStyle(element, property);
          } else if (!value && !isNumber(value)) {
            element.style.removeProperty(property);
          } else {
            element.style.setProperty(property, isNumeric(value) && !cssNumber[property] ? value + "px" : value, priority);
          }
        } else if (isArray(property)) {
          var styles = getStyles(element);
          return property.reduce(function (props, property) {
            props[property] = styles[propName(property)];
            return props;
          }, {});
        } else if (isObject(property)) {
          priority = value;
          each(property, function (value, property) {
            return css(element, property, value, priority);
          });
        }

        return element;
      })[0];
    }

    function getStyles(element, pseudoElt) {
      return toWindow(element).getComputedStyle(element, pseudoElt);
    }

    function getStyle(element, property, pseudoElt) {
      return getStyles(element, pseudoElt)[property];
    }

    var parseCssVar = memoize(function (name) {
      /* usage in css: .uk-name:before { content:"xyz" } */
      var element = append(document.documentElement, document.createElement('div'));
      addClass(element, "uk-" + name);
      name = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');
      remove$1(element);
      return name;
    });

    function getCssVar(name) {
      return !isIE ? getStyles(document.documentElement).getPropertyValue("--uk-" + name) : parseCssVar(name);
    } // https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty


    var propName = memoize(function (name) {
      return vendorPropName(name);
    });
    var cssPrefixes = ['webkit', 'moz', 'ms'];

    function vendorPropName(name) {
      name = hyphenate(name);
      var ref = document.documentElement;
      var style = ref.style;

      if (name in style) {
        return name;
      }

      var i = cssPrefixes.length,
          prefixedName;

      while (i--) {
        prefixedName = "-" + cssPrefixes[i] + "-" + name;

        if (prefixedName in style) {
          return prefixedName;
        }
      }
    }

    function transition(element, props, duration, timing) {
      if (duration === void 0) duration = 400;
      if (timing === void 0) timing = 'linear';
      return Promise$1.all(toNodes(element).map(function (element) {
        return new Promise$1(function (resolve, reject) {
          for (var name in props) {
            var value = css(element, name);

            if (value === '') {
              css(element, name, value);
            }
          }

          var timer = setTimeout(function () {
            return trigger(element, 'transitionend');
          }, duration);
          once(element, 'transitionend transitioncanceled', function (ref) {
            var type = ref.type;
            clearTimeout(timer);
            removeClass(element, 'uk-transition');
            css(element, {
              transitionProperty: '',
              transitionDuration: '',
              transitionTimingFunction: ''
            });
            type === 'transitioncanceled' ? reject() : resolve(element);
          }, {
            self: true
          });
          addClass(element, 'uk-transition');
          css(element, assign({
            transitionProperty: Object.keys(props).map(propName).join(','),
            transitionDuration: duration + "ms",
            transitionTimingFunction: timing
          }, props));
        });
      }));
    }

    var Transition = {
      start: transition,
      stop: function (element) {
        trigger(element, 'transitionend');
        return Promise$1.resolve();
      },
      cancel: function (element) {
        trigger(element, 'transitioncanceled');
      },
      inProgress: function (element) {
        return hasClass(element, 'uk-transition');
      }
    };
    var animationPrefix = 'uk-animation-';

    function animate$1(element, animation, duration, origin, out) {
      if (duration === void 0) duration = 200;
      return Promise$1.all(toNodes(element).map(function (element) {
        return new Promise$1(function (resolve, reject) {
          trigger(element, 'animationcanceled');
          var timer = setTimeout(function () {
            return trigger(element, 'animationend');
          }, duration);
          once(element, 'animationend animationcanceled', function (ref) {
            var type = ref.type;
            clearTimeout(timer);
            type === 'animationcanceled' ? reject() : resolve(element);
            css(element, 'animationDuration', '');
            removeClasses(element, animationPrefix + "\\S*");
          }, {
            self: true
          });
          css(element, 'animationDuration', duration + "ms");
          addClass(element, animation, animationPrefix + (out ? 'leave' : 'enter'));

          if (startsWith(animation, animationPrefix)) {
            origin && addClass(element, "uk-transform-origin-" + origin);
            out && addClass(element, animationPrefix + "reverse");
          }
        });
      }));
    }

    var inProgress = new RegExp(animationPrefix + "(enter|leave)");
    var Animation = {
      in: animate$1,
      out: function (element, animation, duration, origin) {
        return animate$1(element, animation, duration, origin, true);
      },
      inProgress: function (element) {
        return inProgress.test(attr(element, 'class'));
      },
      cancel: function (element) {
        trigger(element, 'animationcanceled');
      }
    };
    var dirs$1 = {
      width: ['left', 'right'],
      height: ['top', 'bottom']
    };

    function dimensions(element) {
      var rect = isElement(element) ? toNode(element).getBoundingClientRect() : {
        height: height(element),
        width: width(element),
        top: 0,
        left: 0
      };
      return {
        height: rect.height,
        width: rect.width,
        top: rect.top,
        left: rect.left,
        bottom: rect.top + rect.height,
        right: rect.left + rect.width
      };
    }

    function offset(element, coordinates) {
      var currentOffset = dimensions(element);
      var ref = toWindow(element);
      var pageYOffset = ref.pageYOffset;
      var pageXOffset = ref.pageXOffset;
      var offsetBy = {
        height: pageYOffset,
        width: pageXOffset
      };

      for (var dir in dirs$1) {
        for (var i in dirs$1[dir]) {
          currentOffset[dirs$1[dir][i]] += offsetBy[dir];
        }
      }

      if (!coordinates) {
        return currentOffset;
      }

      var pos = css(element, 'position');
      each(css(element, ['left', 'top']), function (value, prop) {
        return css(element, prop, coordinates[prop] - currentOffset[prop] + toFloat(pos === 'absolute' && value === 'auto' ? position(element)[prop] : value));
      });
    }

    function position(element) {
      var ref = offset(element);
      var top = ref.top;
      var left = ref.left;
      var ref$1 = toNode(element);
      var ref$1_ownerDocument = ref$1.ownerDocument;
      var body = ref$1_ownerDocument.body;
      var documentElement = ref$1_ownerDocument.documentElement;
      var offsetParent = ref$1.offsetParent;
      var parent = offsetParent || documentElement;

      while (parent && (parent === body || parent === documentElement) && css(parent, 'position') === 'static') {
        parent = parent.parentNode;
      }

      if (isElement(parent)) {
        var parentOffset = offset(parent);
        top -= parentOffset.top + toFloat(css(parent, 'borderTopWidth'));
        left -= parentOffset.left + toFloat(css(parent, 'borderLeftWidth'));
      }

      return {
        top: top - toFloat(css(element, 'marginTop')),
        left: left - toFloat(css(element, 'marginLeft'))
      };
    }

    function offsetPosition(element) {
      var offset = [0, 0];
      element = toNode(element);

      do {
        offset[0] += element.offsetTop;
        offset[1] += element.offsetLeft;

        if (css(element, 'position') === 'fixed') {
          var win = toWindow(element);
          offset[0] += win.pageYOffset;
          offset[1] += win.pageXOffset;
          return offset;
        }
      } while (element = element.offsetParent);

      return offset;
    }

    var height = dimension('height');
    var width = dimension('width');

    function dimension(prop) {
      var propName = ucfirst(prop);
      return function (element, value) {
        if (isUndefined(value)) {
          if (isWindow(element)) {
            return element["inner" + propName];
          }

          if (isDocument(element)) {
            var doc = element.documentElement;
            return Math.max(doc["offset" + propName], doc["scroll" + propName]);
          }

          element = toNode(element);
          value = css(element, prop);
          value = value === 'auto' ? element["offset" + propName] : toFloat(value) || 0;
          return value - boxModelAdjust(element, prop);
        } else {
          return css(element, prop, !value && value !== 0 ? '' : +value + boxModelAdjust(element, prop) + 'px');
        }
      };
    }

    function boxModelAdjust(element, prop, sizing) {
      if (sizing === void 0) sizing = 'border-box';
      return css(element, 'boxSizing') === sizing ? dirs$1[prop].map(ucfirst).reduce(function (value, prop) {
        return value + toFloat(css(element, "padding" + prop)) + toFloat(css(element, "border" + prop + "Width"));
      }, 0) : 0;
    }

    function flipPosition(pos) {
      for (var dir in dirs$1) {
        for (var i in dirs$1[dir]) {
          if (dirs$1[dir][i] === pos) {
            return dirs$1[dir][1 - i];
          }
        }
      }

      return pos;
    }

    function toPx(value, property, element) {
      if (property === void 0) property = 'width';
      if (element === void 0) element = window;
      return isNumeric(value) ? +value : endsWith(value, 'vh') ? percent(height(toWindow(element)), value) : endsWith(value, 'vw') ? percent(width(toWindow(element)), value) : endsWith(value, '%') ? percent(dimensions(element)[property], value) : toFloat(value);
    }

    function percent(base, value) {
      return base * toFloat(value) / 100;
    }
    /*
        Based on:
        Copyright (c) 2016 Wilson Page wilsonpage@me.com
        https://github.com/wilsonpage/fastdom
    */


    var fastdom = {
      reads: [],
      writes: [],
      read: function (task) {
        this.reads.push(task);
        scheduleFlush();
        return task;
      },
      write: function (task) {
        this.writes.push(task);
        scheduleFlush();
        return task;
      },
      clear: function (task) {
        remove(this.reads, task);
        remove(this.writes, task);
      },
      flush: flush
    };

    function flush(recursion) {
      if (recursion === void 0) recursion = 1;
      runTasks(fastdom.reads);
      runTasks(fastdom.writes.splice(0));
      fastdom.scheduled = false;

      if (fastdom.reads.length || fastdom.writes.length) {
        scheduleFlush(recursion + 1);
      }
    }

    var RECURSION_LIMIT = 4;

    function scheduleFlush(recursion) {
      if (fastdom.scheduled) {
        return;
      }

      fastdom.scheduled = true;

      if (recursion && recursion < RECURSION_LIMIT) {
        Promise$1.resolve().then(function () {
          return flush(recursion);
        });
      } else {
        requestAnimationFrame(function () {
          return flush();
        });
      }
    }

    function runTasks(tasks) {
      var task;

      while (task = tasks.shift()) {
        try {
          task();
        } catch (e) {
          console.error(e);
        }
      }
    }

    function remove(array, item) {
      var index = array.indexOf(item);
      return ~index && array.splice(index, 1);
    }

    function MouseTracker() {}

    MouseTracker.prototype = {
      positions: [],
      init: function () {
        var this$1$1 = this;
        this.positions = [];
        var position;
        this.unbind = on(document, 'mousemove', function (e) {
          return position = getEventPos(e);
        });
        this.interval = setInterval(function () {
          if (!position) {
            return;
          }

          this$1$1.positions.push(position);

          if (this$1$1.positions.length > 5) {
            this$1$1.positions.shift();
          }
        }, 50);
      },
      cancel: function () {
        this.unbind && this.unbind();
        this.interval && clearInterval(this.interval);
      },
      movesTo: function (target) {
        if (this.positions.length < 2) {
          return false;
        }

        var p = target.getBoundingClientRect();
        var left = p.left;
        var right = p.right;
        var top = p.top;
        var bottom = p.bottom;
        var ref = this.positions;
        var prevPosition = ref[0];
        var position = last(this.positions);
        var path = [prevPosition, position];

        if (pointInRect(position, p)) {
          return false;
        }

        var diagonals = [[{
          x: left,
          y: top
        }, {
          x: right,
          y: bottom
        }], [{
          x: left,
          y: bottom
        }, {
          x: right,
          y: top
        }]];
        return diagonals.some(function (diagonal) {
          var intersection = intersect(path, diagonal);
          return intersection && pointInRect(intersection, p);
        });
      }
    }; // Inspired by http://paulbourke.net/geometry/pointlineplane/

    function intersect(ref, ref$1) {
      var ref_0 = ref[0];
      var x1 = ref_0.x;
      var y1 = ref_0.y;
      var ref_1 = ref[1];
      var x2 = ref_1.x;
      var y2 = ref_1.y;
      var ref$1_0 = ref$1[0];
      var x3 = ref$1_0.x;
      var y3 = ref$1_0.y;
      var ref$1_1 = ref$1[1];
      var x4 = ref$1_1.x;
      var y4 = ref$1_1.y;
      var denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1); // Lines are parallel

      if (denominator === 0) {
        return false;
      }

      var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;

      if (ua < 0) {
        return false;
      } // Return an object with the x and y coordinates of the intersection


      return {
        x: x1 + ua * (x2 - x1),
        y: y1 + ua * (y2 - y1)
      };
    }

    var strats = {};
    strats.events = strats.created = strats.beforeConnect = strats.connected = strats.beforeDisconnect = strats.disconnected = strats.destroy = concatStrat; // args strategy

    strats.args = function (parentVal, childVal) {
      return childVal !== false && concatStrat(childVal || parentVal);
    }; // update strategy


    strats.update = function (parentVal, childVal) {
      return sortBy$1(concatStrat(parentVal, isFunction(childVal) ? {
        read: childVal
      } : childVal), 'order');
    }; // property strategy


    strats.props = function (parentVal, childVal) {
      if (isArray(childVal)) {
        childVal = childVal.reduce(function (value, key) {
          value[key] = String;
          return value;
        }, {});
      }

      return strats.methods(parentVal, childVal);
    }; // extend strategy


    strats.computed = strats.methods = function (parentVal, childVal) {
      return childVal ? parentVal ? assign({}, parentVal, childVal) : childVal : parentVal;
    }; // data strategy


    strats.data = function (parentVal, childVal, vm) {
      if (!vm) {
        if (!childVal) {
          return parentVal;
        }

        if (!parentVal) {
          return childVal;
        }

        return function (vm) {
          return mergeFnData(parentVal, childVal, vm);
        };
      }

      return mergeFnData(parentVal, childVal, vm);
    };

    function mergeFnData(parentVal, childVal, vm) {
      return strats.computed(isFunction(parentVal) ? parentVal.call(vm, vm) : parentVal, isFunction(childVal) ? childVal.call(vm, vm) : childVal);
    } // concat strategy


    function concatStrat(parentVal, childVal) {
      parentVal = parentVal && !isArray(parentVal) ? [parentVal] : parentVal;
      return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
    } // default strategy


    function defaultStrat(parentVal, childVal) {
      return isUndefined(childVal) ? parentVal : childVal;
    }

    function mergeOptions(parent, child, vm) {
      var options = {};

      if (isFunction(child)) {
        child = child.options;
      }

      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }

      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }

      for (var key in parent) {
        mergeKey(key);
      }

      for (var key$1 in child) {
        if (!hasOwn(parent, key$1)) {
          mergeKey(key$1);
        }
      }

      function mergeKey(key) {
        options[key] = (strats[key] || defaultStrat)(parent[key], child[key], vm);
      }

      return options;
    }

    function parseOptions(options, args) {
      var obj;
      if (args === void 0) args = [];

      try {
        return !options ? {} : startsWith(options, '{') ? JSON.parse(options) : args.length && !includes(options, ':') ? (obj = {}, obj[args[0]] = options, obj) : options.split(';').reduce(function (options, option) {
          var ref = option.split(/:(.*)/);
          var key = ref[0];
          var value = ref[1];

          if (key && !isUndefined(value)) {
            options[key.trim()] = value.trim();
          }

          return options;
        }, {});
      } catch (e) {
        return {};
      }
    }

    function play(el) {
      if (isIFrame(el)) {
        call(el, {
          func: 'playVideo',
          method: 'play'
        });
      }

      if (isHTML5(el)) {
        try {
          el.play().catch(noop);
        } catch (e) {}
      }
    }

    function pause(el) {
      if (isIFrame(el)) {
        call(el, {
          func: 'pauseVideo',
          method: 'pause'
        });
      }

      if (isHTML5(el)) {
        el.pause();
      }
    }

    function mute(el) {
      if (isIFrame(el)) {
        call(el, {
          func: 'mute',
          method: 'setVolume',
          value: 0
        });
      }

      if (isHTML5(el)) {
        el.muted = true;
      }
    }

    function isVideo(el) {
      return isHTML5(el) || isIFrame(el);
    }

    function isHTML5(el) {
      return el && el.tagName === 'VIDEO';
    }

    function isIFrame(el) {
      return el && el.tagName === 'IFRAME' && (isYoutube(el) || isVimeo(el));
    }

    function isYoutube(el) {
      return !!el.src.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/);
    }

    function isVimeo(el) {
      return !!el.src.match(/vimeo\.com\/video\/.*/);
    }

    function call(el, cmd) {
      enableApi(el).then(function () {
        return post(el, cmd);
      });
    }

    function post(el, cmd) {
      try {
        el.contentWindow.postMessage(JSON.stringify(assign({
          event: 'command'
        }, cmd)), '*');
      } catch (e) {}
    }

    var stateKey$1 = '_ukPlayer';
    var counter = 0;

    function enableApi(el) {
      if (el[stateKey$1]) {
        return el[stateKey$1];
      }

      var youtube = isYoutube(el);
      var vimeo = isVimeo(el);
      var id = ++counter;
      var poller;
      return el[stateKey$1] = new Promise$1(function (resolve) {
        youtube && once(el, 'load', function () {
          var listener = function () {
            return post(el, {
              event: 'listening',
              id: id
            });
          };

          poller = setInterval(listener, 100);
          listener();
        });
        once(window, 'message', resolve, false, function (ref) {
          var data = ref.data;

          try {
            data = JSON.parse(data);
            return data && (youtube && data.id === id && data.event === 'onReady' || vimeo && Number(data.player_id) === id);
          } catch (e) {}
        });
        el.src = "" + el.src + (includes(el.src, '?') ? '&' : '?') + (youtube ? 'enablejsapi=1' : "api=1&player_id=" + id);
      }).then(function () {
        return clearInterval(poller);
      });
    }

    function isInView(element, offsetTop, offsetLeft) {
      if (offsetTop === void 0) offsetTop = 0;
      if (offsetLeft === void 0) offsetLeft = 0;

      if (!isVisible(element)) {
        return false;
      }

      return intersectRect.apply(void 0, scrollParents(element).map(function (parent) {
        var ref = offset(getViewport$1(parent));
        var top = ref.top;
        var left = ref.left;
        var bottom = ref.bottom;
        var right = ref.right;
        return {
          top: top - offsetTop,
          left: left - offsetLeft,
          bottom: bottom + offsetTop,
          right: right + offsetLeft
        };
      }).concat(offset(element)));
    }

    function scrollTop(element, top) {
      if (isWindow(element) || isDocument(element)) {
        element = getScrollingElement(element);
      } else {
        element = toNode(element);
      }

      element.scrollTop = top;
    }

    function scrollIntoView(element, ref) {
      if (ref === void 0) ref = {};
      var offsetBy = ref.offset;
      if (offsetBy === void 0) offsetBy = 0;
      var parents = isVisible(element) ? scrollParents(element) : [];
      return parents.reduce(function (fn, scrollElement, i) {
        var scrollTop = scrollElement.scrollTop;
        var scrollHeight = scrollElement.scrollHeight;
        var offsetHeight = scrollElement.offsetHeight;
        var maxScroll = scrollHeight - getViewportClientHeight(scrollElement);
        var ref = offset(parents[i - 1] || element);
        var elHeight = ref.height;
        var elTop = ref.top;
        var top = Math.ceil(elTop - offset(getViewport$1(scrollElement)).top - offsetBy + scrollTop);

        if (offsetBy > 0 && offsetHeight < elHeight + offsetBy) {
          top += offsetBy;
        } else {
          offsetBy = 0;
        }

        if (top > maxScroll) {
          offsetBy -= top - maxScroll;
          top = maxScroll;
        } else if (top < 0) {
          offsetBy -= top;
          top = 0;
        }

        return function () {
          return scrollTo(scrollElement, top - scrollTop).then(fn);
        };
      }, function () {
        return Promise$1.resolve();
      })();

      function scrollTo(element, top) {
        return new Promise$1(function (resolve) {
          var scroll = element.scrollTop;
          var duration = getDuration(Math.abs(top));
          var start = Date.now();

          (function step() {
            var percent = ease(clamp((Date.now() - start) / duration));
            scrollTop(element, scroll + top * percent); // scroll more if we have not reached our destination

            if (percent !== 1) {
              requestAnimationFrame(step);
            } else {
              resolve();
            }
          })();
        });
      }

      function getDuration(dist) {
        return 40 * Math.pow(dist, .375);
      }

      function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
      }
    }

    function scrolledOver(element, heightOffset) {
      if (heightOffset === void 0) heightOffset = 0;

      if (!isVisible(element)) {
        return 0;
      }

      var ref = scrollParents(element, /auto|scroll/, true);
      var scrollElement = ref[0];
      var scrollHeight = scrollElement.scrollHeight;
      var scrollTop = scrollElement.scrollTop;
      var clientHeight = getViewportClientHeight(scrollElement);
      var viewportTop = offsetPosition(element)[0] - scrollTop - offsetPosition(scrollElement)[0];
      var viewportDist = Math.min(clientHeight, viewportTop + scrollTop);
      var top = viewportTop - viewportDist;
      var dist = Math.min(element.offsetHeight + heightOffset + viewportDist, scrollHeight - (viewportTop + scrollTop), scrollHeight - clientHeight);
      return clamp(-1 * top / dist);
    }

    function scrollParents(element, overflowRe, scrollable) {
      if (overflowRe === void 0) overflowRe = /auto|scroll|hidden/;
      if (scrollable === void 0) scrollable = false;
      var scrollEl = getScrollingElement(element);
      var ancestors = parents(element).reverse();
      ancestors = ancestors.slice(ancestors.indexOf(scrollEl) + 1);
      var fixedIndex = findIndex(ancestors, function (el) {
        return css(el, 'position') === 'fixed';
      });

      if (~fixedIndex) {
        ancestors = ancestors.slice(fixedIndex);
      }

      return [scrollEl].concat(ancestors.filter(function (parent) {
        return overflowRe.test(css(parent, 'overflow')) && (!scrollable || parent.scrollHeight > getViewportClientHeight(parent));
      })).reverse();
    }

    function getViewport$1(scrollElement) {
      return scrollElement === getScrollingElement(scrollElement) ? window : scrollElement;
    } // iOS 12 returns <body> as scrollingElement


    function getViewportClientHeight(scrollElement) {
      return (scrollElement === getScrollingElement(scrollElement) ? document.documentElement : scrollElement).clientHeight;
    }

    function getScrollingElement(element) {
      var ref = toWindow(element);
      var document = ref.document;
      return document.scrollingElement || document.documentElement;
    }

    var dirs = {
      width: ['x', 'left', 'right'],
      height: ['y', 'top', 'bottom']
    };

    function positionAt(element, target, elAttach, targetAttach, elOffset, targetOffset, flip, boundary) {
      elAttach = getPos(elAttach);
      targetAttach = getPos(targetAttach);
      var flipped = {
        element: elAttach,
        target: targetAttach
      };

      if (!element || !target) {
        return flipped;
      }

      var dim = offset(element);
      var targetDim = offset(target);
      var position = targetDim;
      moveTo(position, elAttach, dim, -1);
      moveTo(position, targetAttach, targetDim, 1);
      elOffset = getOffsets(elOffset, dim.width, dim.height);
      targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);
      elOffset['x'] += targetOffset['x'];
      elOffset['y'] += targetOffset['y'];
      position.left += elOffset['x'];
      position.top += elOffset['y'];

      if (flip) {
        var boundaries = scrollParents(element).map(getViewport$1);

        if (boundary && !includes(boundaries, boundary)) {
          boundaries.unshift(boundary);
        }

        boundaries = boundaries.map(function (el) {
          return offset(el);
        });
        each(dirs, function (ref, prop) {
          var dir = ref[0];
          var align = ref[1];
          var alignFlip = ref[2];

          if (!(flip === true || includes(flip, dir))) {
            return;
          }

          boundaries.some(function (boundary) {
            var elemOffset = elAttach[dir] === align ? -dim[prop] : elAttach[dir] === alignFlip ? dim[prop] : 0;
            var targetOffset = targetAttach[dir] === align ? targetDim[prop] : targetAttach[dir] === alignFlip ? -targetDim[prop] : 0;

            if (position[align] < boundary[align] || position[align] + dim[prop] > boundary[alignFlip]) {
              var centerOffset = dim[prop] / 2;
              var centerTargetOffset = targetAttach[dir] === 'center' ? -targetDim[prop] / 2 : 0;
              return elAttach[dir] === 'center' && (apply(centerOffset, centerTargetOffset) || apply(-centerOffset, -centerTargetOffset)) || apply(elemOffset, targetOffset);
            }

            function apply(elemOffset, targetOffset) {
              var newVal = toFloat((position[align] + elemOffset + targetOffset - elOffset[dir] * 2).toFixed(4));

              if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
                position[align] = newVal;
                ['element', 'target'].forEach(function (el) {
                  flipped[el][dir] = !elemOffset ? flipped[el][dir] : flipped[el][dir] === dirs[prop][1] ? dirs[prop][2] : dirs[prop][1];
                });
                return true;
              }
            }
          });
        });
      }

      offset(element, position);
      return flipped;
    }

    function moveTo(position, attach, dim, factor) {
      each(dirs, function (ref, prop) {
        var dir = ref[0];
        var align = ref[1];
        var alignFlip = ref[2];

        if (attach[dir] === alignFlip) {
          position[align] += dim[prop] * factor;
        } else if (attach[dir] === 'center') {
          position[align] += dim[prop] * factor / 2;
        }
      });
    }

    function getPos(pos) {
      var x = /left|center|right/;
      var y = /top|center|bottom/;
      pos = (pos || '').split(' ');

      if (pos.length === 1) {
        pos = x.test(pos[0]) ? pos.concat('center') : y.test(pos[0]) ? ['center'].concat(pos) : ['center', 'center'];
      }

      return {
        x: x.test(pos[0]) ? pos[0] : 'center',
        y: y.test(pos[1]) ? pos[1] : 'center'
      };
    }

    function getOffsets(offsets, width, height) {
      var ref = (offsets || '').split(' ');
      var x = ref[0];
      var y = ref[1];
      return {
        x: x ? toFloat(x) * (endsWith(x, '%') ? width / 100 : 1) : 0,
        y: y ? toFloat(y) * (endsWith(y, '%') ? height / 100 : 1) : 0
      };
    }

    var util = /*#__PURE__*/Object.freeze({
      __proto__: null,
      ajax: ajax,
      getImage: getImage,
      transition: transition,
      Transition: Transition,
      animate: animate$1,
      Animation: Animation,
      attr: attr,
      hasAttr: hasAttr,
      removeAttr: removeAttr,
      data: data,
      addClass: addClass,
      removeClass: removeClass,
      removeClasses: removeClasses,
      replaceClass: replaceClass,
      hasClass: hasClass,
      toggleClass: toggleClass,
      dimensions: dimensions,
      offset: offset,
      position: position,
      offsetPosition: offsetPosition,
      height: height,
      width: width,
      boxModelAdjust: boxModelAdjust,
      flipPosition: flipPosition,
      toPx: toPx,
      ready: ready,
      empty: empty,
      html: html,
      prepend: prepend,
      append: append,
      before: before,
      after: after,
      remove: remove$1,
      wrapAll: wrapAll,
      wrapInner: wrapInner,
      unwrap: unwrap,
      fragment: fragment,
      apply: apply$1,
      $: $,
      $$: $$,
      inBrowser: inBrowser,
      isIE: isIE,
      isRtl: isRtl,
      hasTouch: hasTouch,
      pointerDown: pointerDown,
      pointerMove: pointerMove,
      pointerUp: pointerUp,
      pointerEnter: pointerEnter,
      pointerLeave: pointerLeave,
      pointerCancel: pointerCancel,
      on: on,
      off: off,
      once: once,
      trigger: trigger,
      createEvent: createEvent,
      toEventTargets: toEventTargets,
      isTouch: isTouch,
      getEventPos: getEventPos,
      fastdom: fastdom,
      isVoidElement: isVoidElement,
      isVisible: isVisible,
      selInput: selInput,
      isInput: isInput,
      selFocusable: selFocusable,
      isFocusable: isFocusable,
      parent: parent,
      filter: filter$1,
      matches: matches,
      closest: closest,
      within: within,
      parents: parents,
      children: children,
      index: index,
      hasOwn: hasOwn,
      hyphenate: hyphenate,
      camelize: camelize,
      ucfirst: ucfirst,
      startsWith: startsWith,
      endsWith: endsWith,
      includes: includes,
      findIndex: findIndex,
      isArray: isArray,
      isFunction: isFunction,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isWindow: isWindow,
      isDocument: isDocument,
      isNode: isNode,
      isElement: isElement,
      isBoolean: isBoolean,
      isString: isString,
      isNumber: isNumber,
      isNumeric: isNumeric,
      isEmpty: isEmpty,
      isUndefined: isUndefined,
      toBoolean: toBoolean,
      toNumber: toNumber,
      toFloat: toFloat,
      toArray: toArray,
      toNode: toNode,
      toNodes: toNodes,
      toWindow: toWindow,
      toMs: toMs,
      isEqual: isEqual,
      swap: swap,
      assign: assign,
      last: last,
      each: each,
      sortBy: sortBy$1,
      uniqueBy: uniqueBy,
      clamp: clamp,
      noop: noop,
      intersectRect: intersectRect,
      pointInRect: pointInRect,
      Dimensions: Dimensions,
      getIndex: getIndex,
      memoize: memoize,
      MouseTracker: MouseTracker,
      mergeOptions: mergeOptions,
      parseOptions: parseOptions,
      play: play,
      pause: pause,
      mute: mute,
      isVideo: isVideo,
      positionAt: positionAt,
      Promise: Promise$1,
      Deferred: Deferred,
      query: query,
      queryAll: queryAll,
      find: find,
      findAll: findAll,
      escape: escape,
      css: css,
      getCssVar: getCssVar,
      propName: propName,
      isInView: isInView,
      scrollTop: scrollTop,
      scrollIntoView: scrollIntoView,
      scrolledOver: scrolledOver,
      scrollParents: scrollParents,
      getViewport: getViewport$1,
      getViewportClientHeight: getViewportClientHeight
    });

    function globalAPI(UIkit) {
      var DATA = UIkit.data;

      UIkit.use = function (plugin) {
        if (plugin.installed) {
          return;
        }

        plugin.call(null, this);
        plugin.installed = true;
        return this;
      };

      UIkit.mixin = function (mixin, component) {
        component = (isString(component) ? UIkit.component(component) : component) || this;
        component.options = mergeOptions(component.options, mixin);
      };

      UIkit.extend = function (options) {
        options = options || {};
        var Super = this;

        var Sub = function UIkitComponent(options) {
          this._init(options);
        };

        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(Super.options, options);
        Sub.super = Super;
        Sub.extend = Super.extend;
        return Sub;
      };

      UIkit.update = function (element, e) {
        element = element ? toNode(element) : document.body;
        parents(element).reverse().forEach(function (element) {
          return update(element[DATA], e);
        });
        apply$1(element, function (element) {
          return update(element[DATA], e);
        });
      };

      var container;
      Object.defineProperty(UIkit, 'container', {
        get: function () {
          return container || document.body;
        },
        set: function (element) {
          container = $(element);
        }
      });

      function update(data, e) {
        if (!data) {
          return;
        }

        for (var name in data) {
          if (data[name]._connected) {
            data[name]._callUpdate(e);
          }
        }
      }
    }

    function hooksAPI(UIkit) {
      UIkit.prototype._callHook = function (hook) {
        var this$1$1 = this;
        var handlers = this.$options[hook];

        if (handlers) {
          handlers.forEach(function (handler) {
            return handler.call(this$1$1);
          });
        }
      };

      UIkit.prototype._callConnected = function () {
        if (this._connected) {
          return;
        }

        this._data = {};
        this._computeds = {};

        this._initProps();

        this._callHook('beforeConnect');

        this._connected = true;

        this._initEvents();

        this._initObservers();

        this._callHook('connected');

        this._callUpdate();
      };

      UIkit.prototype._callDisconnected = function () {
        if (!this._connected) {
          return;
        }

        this._callHook('beforeDisconnect');

        this._disconnectObservers();

        this._unbindEvents();

        this._callHook('disconnected');

        this._connected = false;
        delete this._watch;
      };

      UIkit.prototype._callUpdate = function (e) {
        var this$1$1 = this;
        if (e === void 0) e = 'update';

        if (!this._connected) {
          return;
        }

        if (e === 'update' || e === 'resize') {
          this._callWatches();
        }

        if (!this.$options.update) {
          return;
        }

        if (!this._updates) {
          this._updates = new Set();
          fastdom.read(function () {
            if (this$1$1._connected) {
              runUpdates.call(this$1$1, this$1$1._updates);
            }

            delete this$1$1._updates;
          });
        }

        this._updates.add(e.type || e);
      };

      UIkit.prototype._callWatches = function () {
        var this$1$1 = this;

        if (this._watch) {
          return;
        }

        var initial = !hasOwn(this, '_watch');
        this._watch = fastdom.read(function () {
          if (this$1$1._connected) {
            runWatches.call(this$1$1, initial);
          }

          this$1$1._watch = null;
        });
      };

      function runUpdates(types) {
        var this$1$1 = this;
        var updates = this.$options.update;

        var loop = function (i) {
          var ref = updates[i];
          var read = ref.read;
          var write = ref.write;
          var events = ref.events;

          if (!types.has('update') && (!events || !events.some(function (type) {
            return types.has(type);
          }))) {
            return;
          }

          var result = void 0;

          if (read) {
            result = read.call(this$1$1, this$1$1._data, types);

            if (result && isPlainObject(result)) {
              assign(this$1$1._data, result);
            }
          }

          if (write && result !== false) {
            fastdom.write(function () {
              return write.call(this$1$1, this$1$1._data, types);
            });
          }
        };

        for (var i = 0; i < updates.length; i++) loop(i);
      }

      function runWatches(initial) {
        var ref = this;
        var computed = ref.$options.computed;
        var _computeds = ref._computeds;

        for (var key in computed) {
          var hasPrev = hasOwn(_computeds, key);
          var prev = _computeds[key];
          delete _computeds[key];
          var ref$1 = computed[key];
          var watch = ref$1.watch;
          var immediate = ref$1.immediate;

          if (watch && (initial && immediate || hasPrev && !isEqual(prev, this[key]))) {
            watch.call(this, this[key], prev);
          }
        }
      }
    }

    function stateAPI(UIkit) {
      var uid = 0;

      UIkit.prototype._init = function (options) {
        options = options || {};
        options.data = normalizeData(options, this.constructor.options);
        this.$options = mergeOptions(this.constructor.options, options, this);
        this.$el = null;
        this.$props = {};
        this._uid = uid++;

        this._initData();

        this._initMethods();

        this._initComputeds();

        this._callHook('created');

        if (options.el) {
          this.$mount(options.el);
        }
      };

      UIkit.prototype._initData = function () {
        var ref = this.$options;
        var data = ref.data;
        if (data === void 0) data = {};

        for (var key in data) {
          this.$props[key] = this[key] = data[key];
        }
      };

      UIkit.prototype._initMethods = function () {
        var ref = this.$options;
        var methods = ref.methods;

        if (methods) {
          for (var key in methods) {
            this[key] = methods[key].bind(this);
          }
        }
      };

      UIkit.prototype._initComputeds = function () {
        var ref = this.$options;
        var computed = ref.computed;
        this._computeds = {};

        if (computed) {
          for (var key in computed) {
            registerComputed(this, key, computed[key]);
          }
        }
      };

      UIkit.prototype._initProps = function (props) {
        var key;
        props = props || getProps(this.$options, this.$name);

        for (key in props) {
          if (!isUndefined(props[key])) {
            this.$props[key] = props[key];
          }
        }

        var exclude = [this.$options.computed, this.$options.methods];

        for (key in this.$props) {
          if (key in props && notIn(exclude, key)) {
            this[key] = this.$props[key];
          }
        }
      };

      UIkit.prototype._initEvents = function () {
        var this$1$1 = this;
        this._events = [];
        var ref = this.$options;
        var events = ref.events;

        if (events) {
          events.forEach(function (event) {
            if (!hasOwn(event, 'handler')) {
              for (var key in event) {
                registerEvent(this$1$1, event[key], key);
              }
            } else {
              registerEvent(this$1$1, event);
            }
          });
        }
      };

      UIkit.prototype._unbindEvents = function () {
        this._events.forEach(function (unbind) {
          return unbind();
        });

        delete this._events;
      };

      UIkit.prototype._initObservers = function () {
        this._observers = [initChildListObserver(this), initPropsObserver(this)];
      };

      UIkit.prototype._disconnectObservers = function () {
        this._observers.forEach(function (observer) {
          return observer && observer.disconnect();
        });
      };

      function getProps(opts, name) {
        var data$1 = {};
        var args = opts.args;
        if (args === void 0) args = [];
        var props = opts.props;
        if (props === void 0) props = {};
        var el = opts.el;

        if (!props) {
          return data$1;
        }

        for (var key in props) {
          var prop = hyphenate(key);
          var value = data(el, prop);

          if (isUndefined(value)) {
            continue;
          }

          value = props[key] === Boolean && value === '' ? true : coerce(props[key], value);

          if (prop === 'target' && (!value || startsWith(value, '_'))) {
            continue;
          }

          data$1[key] = value;
        }

        var options = parseOptions(data(el, name), args);

        for (var key$1 in options) {
          var prop$1 = camelize(key$1);

          if (props[prop$1] !== undefined) {
            data$1[prop$1] = coerce(props[prop$1], options[key$1]);
          }
        }

        return data$1;
      }

      function registerComputed(component, key, cb) {
        Object.defineProperty(component, key, {
          enumerable: true,
          get: function () {
            var _computeds = component._computeds;
            var $props = component.$props;
            var $el = component.$el;

            if (!hasOwn(_computeds, key)) {
              _computeds[key] = (cb.get || cb).call(component, $props, $el);
            }

            return _computeds[key];
          },
          set: function (value) {
            var _computeds = component._computeds;
            _computeds[key] = cb.set ? cb.set.call(component, value) : value;

            if (isUndefined(_computeds[key])) {
              delete _computeds[key];
            }
          }
        });
      }

      function registerEvent(component, event, key) {
        if (!isPlainObject(event)) {
          event = {
            name: key,
            handler: event
          };
        }

        var name = event.name;
        var el = event.el;
        var handler = event.handler;
        var capture = event.capture;
        var passive = event.passive;
        var delegate = event.delegate;
        var filter = event.filter;
        var self = event.self;
        el = isFunction(el) ? el.call(component) : el || component.$el;

        if (isArray(el)) {
          el.forEach(function (el) {
            return registerEvent(component, assign({}, event, {
              el: el
            }), key);
          });
          return;
        }

        if (!el || filter && !filter.call(component)) {
          return;
        }

        component._events.push(on(el, name, !delegate ? null : isString(delegate) ? delegate : delegate.call(component), isString(handler) ? component[handler] : handler.bind(component), {
          passive: passive,
          capture: capture,
          self: self
        }));
      }

      function notIn(options, key) {
        return options.every(function (arr) {
          return !arr || !hasOwn(arr, key);
        });
      }

      function coerce(type, value) {
        if (type === Boolean) {
          return toBoolean(value);
        } else if (type === Number) {
          return toNumber(value);
        } else if (type === 'list') {
          return toList(value);
        }

        return type ? type(value) : value;
      }

      function toList(value) {
        return isArray(value) ? value : isString(value) ? value.split(/,(?![^(]*\))/).map(function (value) {
          return isNumeric(value) ? toNumber(value) : toBoolean(value.trim());
        }) : [value];
      }

      function normalizeData(ref, ref$1) {
        var data = ref.data;
        var args = ref$1.args;
        var props = ref$1.props;
        if (props === void 0) props = {};
        data = isArray(data) ? !isEmpty(args) ? data.slice(0, args.length).reduce(function (data, value, index) {
          if (isPlainObject(value)) {
            assign(data, value);
          } else {
            data[args[index]] = value;
          }

          return data;
        }, {}) : undefined : data;

        if (data) {
          for (var key in data) {
            if (isUndefined(data[key])) {
              delete data[key];
            } else {
              data[key] = props[key] ? coerce(props[key], data[key]) : data[key];
            }
          }
        }

        return data;
      }

      function initChildListObserver(component) {
        var ref = component.$options;
        var el = ref.el;
        var observer = new MutationObserver(function () {
          return component.$emit();
        });
        observer.observe(el, {
          childList: true,
          subtree: true
        });
        return observer;
      }

      function initPropsObserver(component) {
        var $name = component.$name;
        var $options = component.$options;
        var $props = component.$props;
        var attrs = $options.attrs;
        var props = $options.props;
        var el = $options.el;

        if (!props || attrs === false) {
          return;
        }

        var attributes = isArray(attrs) ? attrs : Object.keys(props);
        var filter = attributes.map(function (key) {
          return hyphenate(key);
        }).concat($name);
        var observer = new MutationObserver(function (records) {
          var data = getProps($options, $name);

          if (records.some(function (ref) {
            var attributeName = ref.attributeName;
            var prop = attributeName.replace('data-', '');
            return (prop === $name ? attributes : [camelize(prop), camelize(attributeName)]).some(function (prop) {
              return !isUndefined(data[prop]) && data[prop] !== $props[prop];
            });
          })) {
            component.$reset();
          }
        });
        observer.observe(el, {
          attributes: true,
          attributeFilter: filter.concat(filter.map(function (key) {
            return "data-" + key;
          }))
        });
        return observer;
      }
    }

    function instanceAPI(UIkit) {
      var DATA = UIkit.data;

      UIkit.prototype.$create = function (component, element, data) {
        return UIkit[component](element, data);
      };

      UIkit.prototype.$mount = function (el) {
        var ref = this.$options;
        var name = ref.name;

        if (!el[DATA]) {
          el[DATA] = {};
        }

        if (el[DATA][name]) {
          return;
        }

        el[DATA][name] = this;
        this.$el = this.$options.el = this.$options.el || el;

        if (within(el, document)) {
          this._callConnected();
        }
      };

      UIkit.prototype.$reset = function () {
        this._callDisconnected();

        this._callConnected();
      };

      UIkit.prototype.$destroy = function (removeEl) {
        if (removeEl === void 0) removeEl = false;
        var ref = this.$options;
        var el = ref.el;
        var name = ref.name;

        if (el) {
          this._callDisconnected();
        }

        this._callHook('destroy');

        if (!el || !el[DATA]) {
          return;
        }

        delete el[DATA][name];

        if (!isEmpty(el[DATA])) {
          delete el[DATA];
        }

        if (removeEl) {
          remove$1(this.$el);
        }
      };

      UIkit.prototype.$emit = function (e) {
        this._callUpdate(e);
      };

      UIkit.prototype.$update = function (element, e) {
        if (element === void 0) element = this.$el;
        UIkit.update(element, e);
      };

      UIkit.prototype.$getComponent = UIkit.getComponent;
      var componentName = memoize(function (name) {
        return UIkit.prefix + hyphenate(name);
      });
      Object.defineProperties(UIkit.prototype, {
        $container: Object.getOwnPropertyDescriptor(UIkit, 'container'),
        $name: {
          get: function () {
            return componentName(this.$options.name);
          }
        }
      });
    }

    function componentAPI(UIkit) {
      var DATA = UIkit.data;
      var components = {};

      UIkit.component = function (name, options) {
        var id = hyphenate(name);
        name = camelize(id);

        if (!options) {
          if (isPlainObject(components[name])) {
            components[name] = UIkit.extend(components[name]);
          }

          return components[name];
        }

        UIkit[name] = function (element, data) {
          var i = arguments.length,
              argsArray = Array(i);

          while (i--) argsArray[i] = arguments[i];

          var component = UIkit.component(name);
          return component.options.functional ? new component({
            data: isPlainObject(element) ? element : [].concat(argsArray)
          }) : !element ? init(element) : $$(element).map(init)[0];

          function init(element) {
            var instance = UIkit.getComponent(element, name);

            if (instance) {
              if (!data) {
                return instance;
              } else {
                instance.$destroy();
              }
            }

            return new component({
              el: element,
              data: data
            });
          }
        };

        var opt = isPlainObject(options) ? assign({}, options) : options.options;
        opt.name = name;

        if (opt.install) {
          opt.install(UIkit, opt, name);
        }

        if (UIkit._initialized && !opt.functional) {
          fastdom.read(function () {
            return UIkit[name]("[uk-" + id + "],[data-uk-" + id + "]");
          });
        }

        return components[name] = isPlainObject(options) ? opt : options;
      };

      UIkit.getComponents = function (element) {
        return element && element[DATA] || {};
      };

      UIkit.getComponent = function (element, name) {
        return UIkit.getComponents(element)[name];
      };

      UIkit.connect = function (node) {
        if (node[DATA]) {
          for (var name in node[DATA]) {
            node[DATA][name]._callConnected();
          }
        }

        for (var i = 0; i < node.attributes.length; i++) {
          var name$1 = getComponentName(node.attributes[i].name);

          if (name$1 && name$1 in components) {
            UIkit[name$1](node);
          }
        }
      };

      UIkit.disconnect = function (node) {
        for (var name in node[DATA]) {
          node[DATA][name]._callDisconnected();
        }
      };
    }

    var getComponentName = memoize(function (attribute) {
      return startsWith(attribute, 'uk-') || startsWith(attribute, 'data-uk-') ? camelize(attribute.replace('data-uk-', '').replace('uk-', '')) : false;
    });

    var UIkit = function (options) {
      this._init(options);
    };

    UIkit.util = util;
    UIkit.data = '__uikit__';
    UIkit.prefix = 'uk-';
    UIkit.options = {};
    UIkit.version = '3.8.1';
    globalAPI(UIkit);
    hooksAPI(UIkit);
    stateAPI(UIkit);
    componentAPI(UIkit);
    instanceAPI(UIkit);

    function Core(UIkit) {
      if (!inBrowser) {
        return;
      } // throttle 'resize'


      var pendingResize;

      var handleResize = function () {
        if (pendingResize) {
          return;
        }

        pendingResize = true;
        fastdom.write(function () {
          return pendingResize = false;
        });
        UIkit.update(null, 'resize');
      };

      on(window, 'load resize', handleResize);
      on(document, 'loadedmetadata load', handleResize, true);

      if ('ResizeObserver' in window) {
        new ResizeObserver(handleResize).observe(document.documentElement);
      } // throttle `scroll` event (Safari triggers multiple `scroll` events per frame)


      var pending;
      on(window, 'scroll', function (e) {
        if (pending) {
          return;
        }

        pending = true;
        fastdom.write(function () {
          return pending = false;
        });
        UIkit.update(null, e.type);
      }, {
        passive: true,
        capture: true
      });
      var started = 0;
      on(document, 'animationstart', function (ref) {
        var target = ref.target;

        if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {
          started++;
          css(document.documentElement, 'overflowX', 'hidden');
          setTimeout(function () {
            if (! --started) {
              css(document.documentElement, 'overflowX', '');
            }
          }, toMs(css(target, 'animationDuration')) + 100);
        }
      }, true);
      on(document, pointerDown, function (e) {
        if (!isTouch(e)) {
          return;
        } // Handle Swipe Gesture


        var pos = getEventPos(e);
        var target = 'tagName' in e.target ? e.target : parent(e.target);
        once(document, pointerUp + " " + pointerCancel + " scroll", function (e) {
          var ref = getEventPos(e);
          var x = ref.x;
          var y = ref.y; // swipe

          if (e.type !== 'scroll' && target && x && Math.abs(pos.x - x) > 100 || y && Math.abs(pos.y - y) > 100) {
            setTimeout(function () {
              trigger(target, 'swipe');
              trigger(target, "swipe" + swipeDirection(pos.x, pos.y, x, y));
            });
          }
        });
      }, {
        passive: true
      });
    }

    function swipeDirection(x1, y1, x2, y2) {
      return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
    }

    function boot(UIkit) {
      var connect = UIkit.connect;
      var disconnect = UIkit.disconnect;

      if (!inBrowser || !window.MutationObserver) {
        return;
      }

      fastdom.read(function () {
        if (document.body) {
          apply$1(document.body, connect);
        }

        new MutationObserver(function (records) {
          return records.forEach(applyChildListMutation);
        }).observe(document, {
          childList: true,
          subtree: true
        });
        new MutationObserver(function (records) {
          return records.forEach(applyAttributeMutation);
        }).observe(document, {
          attributes: true,
          subtree: true
        });
        UIkit._initialized = true;
      });

      function applyChildListMutation(ref) {
        var addedNodes = ref.addedNodes;
        var removedNodes = ref.removedNodes;

        for (var i = 0; i < addedNodes.length; i++) {
          apply$1(addedNodes[i], connect);
        }

        for (var i$1 = 0; i$1 < removedNodes.length; i$1++) {
          apply$1(removedNodes[i$1], disconnect);
        }
      }

      function applyAttributeMutation(ref) {
        var target = ref.target;
        var attributeName = ref.attributeName;
        var name = getComponentName(attributeName);

        if (!name || !(name in UIkit)) {
          return;
        }

        if (hasAttr(target, attributeName)) {
          UIkit[name](target);
          return;
        }

        var component = UIkit.getComponent(target, name);

        if (component) {
          component.$destroy();
        }
      }
    }

    var Class = {
      connected: function () {
        !hasClass(this.$el, this.$name) && addClass(this.$el, this.$name);
      }
    };
    var Togglable = {
      props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        origin: String,
        transition: String
      },
      data: {
        cls: false,
        animation: [false],
        duration: 200,
        origin: false,
        transition: 'linear',
        clsEnter: 'uk-togglabe-enter',
        clsLeave: 'uk-togglabe-leave',
        initProps: {
          overflow: '',
          height: '',
          paddingTop: '',
          paddingBottom: '',
          marginTop: '',
          marginBottom: ''
        },
        hideProps: {
          overflow: 'hidden',
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          marginTop: 0,
          marginBottom: 0
        }
      },
      computed: {
        hasAnimation: function (ref) {
          var animation = ref.animation;
          return !!animation[0];
        },
        hasTransition: function (ref) {
          var animation = ref.animation;
          return this.hasAnimation && animation[0] === true;
        }
      },
      methods: {
        toggleElement: function (targets, toggle, animate) {
          var this$1$1 = this;
          return new Promise$1(function (resolve) {
            return Promise$1.all(toNodes(targets).map(function (el) {
              var show = isBoolean(toggle) ? toggle : !this$1$1.isToggled(el);

              if (!trigger(el, "before" + (show ? 'show' : 'hide'), [this$1$1])) {
                return Promise$1.reject();
              }

              var promise = (isFunction(animate) ? animate : animate === false || !this$1$1.hasAnimation ? this$1$1._toggle : this$1$1.hasTransition ? toggleHeight(this$1$1) : toggleAnimation(this$1$1))(el, show);
              var cls = show ? this$1$1.clsEnter : this$1$1.clsLeave;
              addClass(el, cls);
              trigger(el, show ? 'show' : 'hide', [this$1$1]);

              var done = function () {
                removeClass(el, cls);
                trigger(el, show ? 'shown' : 'hidden', [this$1$1]);
                this$1$1.$update(el);
              };

              return promise ? promise.then(done, function () {
                removeClass(el, cls);
                return Promise$1.reject();
              }) : done();
            })).then(resolve, noop);
          });
        },
        isToggled: function (el) {
          var assign;
          if (el === void 0) el = this.$el;
          assign = toNodes(el), el = assign[0];
          return hasClass(el, this.clsEnter) ? true : hasClass(el, this.clsLeave) ? false : this.cls ? hasClass(el, this.cls.split(' ')[0]) : isVisible(el);
        },
        _toggle: function (el, toggled) {
          if (!el) {
            return;
          }

          toggled = Boolean(toggled);
          var changed;

          if (this.cls) {
            changed = includes(this.cls, ' ') || toggled !== hasClass(el, this.cls);
            changed && toggleClass(el, this.cls, includes(this.cls, ' ') ? undefined : toggled);
          } else {
            changed = toggled === el.hidden;
            changed && (el.hidden = !toggled);
          }

          $$('[autofocus]', el).some(function (el) {
            return isVisible(el) ? el.focus() || true : el.blur();
          });

          if (changed) {
            trigger(el, 'toggled', [toggled, this]);
            this.$update(el);
          }
        }
      }
    };

    function toggleHeight(ref) {
      var isToggled = ref.isToggled;
      var duration = ref.duration;
      var initProps = ref.initProps;
      var hideProps = ref.hideProps;
      var transition = ref.transition;
      var _toggle = ref._toggle;
      return function (el, show) {
        var inProgress = Transition.inProgress(el);
        var inner = el.hasChildNodes ? toFloat(css(el.firstElementChild, 'marginTop')) + toFloat(css(el.lastElementChild, 'marginBottom')) : 0;
        var currentHeight = isVisible(el) ? height(el) + (inProgress ? 0 : inner) : 0;
        Transition.cancel(el);

        if (!isToggled(el)) {
          _toggle(el, true);
        }

        height(el, ''); // Update child components first

        fastdom.flush();
        var endHeight = height(el) + (inProgress ? 0 : inner);
        height(el, currentHeight);
        return (show ? Transition.start(el, assign({}, initProps, {
          overflow: 'hidden',
          height: endHeight
        }), Math.round(duration * (1 - currentHeight / endHeight)), transition) : Transition.start(el, hideProps, Math.round(duration * (currentHeight / endHeight)), transition).then(function () {
          return _toggle(el, false);
        })).then(function () {
          return css(el, initProps);
        });
      };
    }

    function toggleAnimation(cmp) {
      return function (el, show) {
        Animation.cancel(el);
        var animation = cmp.animation;
        var duration = cmp.duration;
        var _toggle = cmp._toggle;

        if (show) {
          _toggle(el, true);

          return Animation.in(el, animation[0], duration, cmp.origin);
        }

        return Animation.out(el, animation[1] || animation[0], duration, cmp.origin).then(function () {
          return _toggle(el, false);
        });
      };
    }

    var Accordion = {
      mixins: [Class, Togglable],
      props: {
        targets: String,
        active: null,
        collapsible: Boolean,
        multiple: Boolean,
        toggle: String,
        content: String,
        transition: String,
        offset: Number
      },
      data: {
        targets: '> *',
        active: false,
        animation: [true],
        collapsible: true,
        multiple: false,
        clsOpen: 'uk-open',
        toggle: '> .uk-accordion-title',
        content: '> .uk-accordion-content',
        transition: 'ease',
        offset: 0
      },
      computed: {
        items: {
          get: function (ref, $el) {
            var targets = ref.targets;
            return $$(targets, $el);
          },
          watch: function (items, prev) {
            var this$1$1 = this;
            items.forEach(function (el) {
              return hide($(this$1$1.content, el), !hasClass(el, this$1$1.clsOpen));
            });

            if (prev || hasClass(items, this.clsOpen)) {
              return;
            }

            var active = this.active !== false && items[Number(this.active)] || !this.collapsible && items[0];

            if (active) {
              this.toggle(active, false);
            }
          },
          immediate: true
        },
        toggles: function (ref) {
          var toggle = ref.toggle;
          return this.items.map(function (item) {
            return $(toggle, item);
          });
        }
      },
      events: [{
        name: 'click',
        delegate: function () {
          return this.targets + " " + this.$props.toggle;
        },
        handler: function (e) {
          e.preventDefault();
          this.toggle(index(this.toggles, e.current));
        }
      }],
      methods: {
        toggle: function (item, animate) {
          var this$1$1 = this;
          var items = [this.items[getIndex(item, this.items)]];
          var activeItems = filter$1(this.items, "." + this.clsOpen);

          if (!this.multiple && !includes(activeItems, items[0])) {
            items = items.concat(activeItems);
          }

          if (!this.collapsible && activeItems.length < 2 && !filter$1(items, ":not(." + this.clsOpen + ")").length) {
            return;
          }

          items.forEach(function (el) {
            return this$1$1.toggleElement(el, !hasClass(el, this$1$1.clsOpen), function (el, show) {
              toggleClass(el, this$1$1.clsOpen, show);
              attr($(this$1$1.$props.toggle, el), 'aria-expanded', show);
              var content = $("" + (el._wrapper ? '> * ' : '') + this$1$1.content, el);

              if (animate === false || !this$1$1.hasTransition) {
                hide(content, !show);
                return;
              }

              if (!el._wrapper) {
                el._wrapper = wrapAll(content, "<div" + (show ? ' hidden' : '') + ">");
              }

              hide(content, false);
              return toggleHeight(this$1$1)(el._wrapper, show).then(function () {
                hide(content, !show);
                delete el._wrapper;
                unwrap(content);

                if (show) {
                  var toggle = $(this$1$1.$props.toggle, el);

                  if (!isInView(toggle)) {
                    scrollIntoView(toggle, {
                      offset: this$1$1.offset
                    });
                  }
                }
              });
            });
          });
        }
      }
    };

    function hide(el, hide) {
      el && (el.hidden = hide);
    }

    var alert = {
      mixins: [Class, Togglable],
      args: 'animation',
      props: {
        close: String
      },
      data: {
        animation: [true],
        selClose: '.uk-alert-close',
        duration: 150,
        hideProps: assign({
          opacity: 0
        }, Togglable.data.hideProps)
      },
      events: [{
        name: 'click',
        delegate: function () {
          return this.selClose;
        },
        handler: function (e) {
          e.preventDefault();
          this.close();
        }
      }],
      methods: {
        close: function () {
          var this$1$1 = this;
          this.toggleElement(this.$el).then(function () {
            return this$1$1.$destroy(true);
          });
        }
      }
    };
    var Video = {
      args: 'autoplay',
      props: {
        automute: Boolean,
        autoplay: Boolean
      },
      data: {
        automute: false,
        autoplay: true
      },
      computed: {
        inView: function (ref) {
          var autoplay = ref.autoplay;
          return autoplay === 'inview';
        }
      },
      connected: function () {
        if (this.inView && !hasAttr(this.$el, 'preload')) {
          this.$el.preload = 'none';
        }

        if (this.automute) {
          mute(this.$el);
        }
      },
      update: {
        read: function () {
          if (!isVideo(this.$el)) {
            return false;
          }

          return {
            visible: isVisible(this.$el) && css(this.$el, 'visibility') !== 'hidden',
            inView: this.inView && isInView(this.$el)
          };
        },
        write: function (ref) {
          var visible = ref.visible;
          var inView = ref.inView;

          if (!visible || this.inView && !inView) {
            pause(this.$el);
          } else if (this.autoplay === true || this.inView && inView) {
            play(this.$el);
          }
        },
        events: ['resize', 'scroll']
      }
    };
    var cover = {
      mixins: [Class, Video],
      props: {
        width: Number,
        height: Number
      },
      data: {
        automute: true
      },
      update: {
        read: function () {
          var el = this.$el;
          var ref = getPositionedParent(el) || parent(el);
          var height = ref.offsetHeight;
          var width = ref.offsetWidth;
          var dim = Dimensions.cover({
            width: this.width || el.naturalWidth || el.videoWidth || el.clientWidth,
            height: this.height || el.naturalHeight || el.videoHeight || el.clientHeight
          }, {
            width: width + (width % 2 ? 1 : 0),
            height: height + (height % 2 ? 1 : 0)
          });

          if (!dim.width || !dim.height) {
            return false;
          }

          return dim;
        },
        write: function (ref) {
          var height = ref.height;
          var width = ref.width;
          css(this.$el, {
            height: height,
            width: width
          });
        },
        events: ['resize']
      }
    };

    function getPositionedParent(el) {
      while (el = parent(el)) {
        if (css(el, 'position') !== 'static') {
          return el;
        }
      }
    }

    var Container = {
      props: {
        container: Boolean
      },
      data: {
        container: true
      },
      computed: {
        container: function (ref) {
          var container = ref.container;
          return container === true && this.$container || container && $(container);
        }
      }
    };
    var Position = {
      props: {
        pos: String,
        offset: null,
        flip: Boolean,
        clsPos: String
      },
      data: {
        pos: "bottom-" + (!isRtl ? 'left' : 'right'),
        flip: true,
        offset: false,
        clsPos: ''
      },
      computed: {
        pos: function (ref) {
          var pos = ref.pos;
          return (pos + (!includes(pos, '-') ? '-center' : '')).split('-');
        },
        dir: function () {
          return this.pos[0];
        },
        align: function () {
          return this.pos[1];
        }
      },
      methods: {
        positionAt: function (element, target, boundary) {
          removeClasses(element, this.clsPos + "-(top|bottom|left|right)(-[a-z]+)?");
          var ref = this;
          var offset$1 = ref.offset;
          var axis = this.getAxis();

          if (!isNumeric(offset$1)) {
            var node = $(offset$1);
            offset$1 = node ? offset(node)[axis === 'x' ? 'left' : 'top'] - offset(target)[axis === 'x' ? 'right' : 'bottom'] : 0;
          }

          var ref$1 = positionAt(element, target, axis === 'x' ? flipPosition(this.dir) + " " + this.align : this.align + " " + flipPosition(this.dir), axis === 'x' ? this.dir + " " + this.align : this.align + " " + this.dir, axis === 'x' ? "" + (this.dir === 'left' ? -offset$1 : offset$1) : " " + (this.dir === 'top' ? -offset$1 : offset$1), null, this.flip, boundary).target;
          var x = ref$1.x;
          var y = ref$1.y;
          this.dir = axis === 'x' ? x : y;
          this.align = axis === 'x' ? y : x;
          toggleClass(element, this.clsPos + "-" + this.dir + "-" + this.align, this.offset === false);
        },
        getAxis: function () {
          return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
        }
      }
    };
    var active$1;
    var drop = {
      mixins: [Container, Position, Togglable],
      args: 'pos',
      props: {
        mode: 'list',
        toggle: Boolean,
        boundary: Boolean,
        boundaryAlign: Boolean,
        delayShow: Number,
        delayHide: Number,
        clsDrop: String
      },
      data: {
        mode: ['click', 'hover'],
        toggle: '- *',
        boundary: true,
        boundaryAlign: false,
        delayShow: 0,
        delayHide: 800,
        clsDrop: false,
        animation: ['uk-animation-fade'],
        cls: 'uk-open',
        container: false
      },
      computed: {
        boundary: function (ref, $el) {
          var boundary = ref.boundary;
          return boundary === true ? window : query(boundary, $el);
        },
        clsDrop: function (ref) {
          var clsDrop = ref.clsDrop;
          return clsDrop || "uk-" + this.$options.name;
        },
        clsPos: function () {
          return this.clsDrop;
        }
      },
      created: function () {
        this.tracker = new MouseTracker();
      },
      connected: function () {
        addClass(this.$el, this.clsDrop);

        if (this.toggle && !this.target) {
          this.target = this.$create('toggle', query(this.toggle, this.$el), {
            target: this.$el,
            mode: this.mode
          });
        }
      },
      disconnected: function () {
        if (this.isActive()) {
          active$1 = null;
        }
      },
      events: [{
        name: 'click',
        delegate: function () {
          return "." + this.clsDrop + "-close";
        },
        handler: function (e) {
          e.preventDefault();
          this.hide(false);
        }
      }, {
        name: 'click',
        delegate: function () {
          return 'a[href^="#"]';
        },
        handler: function (ref) {
          var defaultPrevented = ref.defaultPrevented;
          var hash = ref.current.hash;

          if (!defaultPrevented && hash && !within(hash, this.$el)) {
            this.hide(false);
          }
        }
      }, {
        name: 'beforescroll',
        handler: function () {
          this.hide(false);
        }
      }, {
        name: 'toggle',
        self: true,
        handler: function (e, toggle) {
          e.preventDefault();

          if (this.isToggled()) {
            this.hide(false);
          } else {
            this.show(toggle.$el, false);
          }
        }
      }, {
        name: 'toggleshow',
        self: true,
        handler: function (e, toggle) {
          e.preventDefault();
          this.show(toggle.$el);
        }
      }, {
        name: 'togglehide',
        self: true,
        handler: function (e) {
          e.preventDefault();

          if (!matches(this.$el, ':focus,:hover')) {
            this.hide();
          }
        }
      }, {
        name: pointerEnter + " focusin",
        filter: function () {
          return includes(this.mode, 'hover');
        },
        handler: function (e) {
          if (!isTouch(e)) {
            this.clearTimers();
          }
        }
      }, {
        name: pointerLeave + " focusout",
        filter: function () {
          return includes(this.mode, 'hover');
        },
        handler: function (e) {
          if (!isTouch(e) && e.relatedTarget) {
            this.hide();
          }
        }
      }, {
        name: 'toggled',
        self: true,
        handler: function (e, toggled) {
          if (!toggled) {
            return;
          }

          this.clearTimers();
          this.position();
        }
      }, {
        name: 'show',
        self: true,
        handler: function () {
          var this$1$1 = this;
          active$1 = this;
          this.tracker.init();
          once(this.$el, 'hide', on(document, pointerDown, function (ref) {
            var target = ref.target;
            return !within(target, this$1$1.$el) && once(document, pointerUp + " " + pointerCancel + " scroll", function (ref) {
              var defaultPrevented = ref.defaultPrevented;
              var type = ref.type;
              var newTarget = ref.target;

              if (!defaultPrevented && type === pointerUp && target === newTarget && !(this$1$1.target && within(target, this$1$1.target))) {
                this$1$1.hide(false);
              }
            }, true);
          }), {
            self: true
          });
          once(this.$el, 'hide', on(document, 'keydown', function (e) {
            if (e.keyCode === 27) {
              this$1$1.hide(false);
            }
          }), {
            self: true
          });
        }
      }, {
        name: 'beforehide',
        self: true,
        handler: function () {
          this.clearTimers();
        }
      }, {
        name: 'hide',
        handler: function (ref) {
          var target = ref.target;

          if (this.$el !== target) {
            active$1 = active$1 === null && within(target, this.$el) && this.isToggled() ? this : active$1;
            return;
          }

          active$1 = this.isActive() ? null : active$1;
          this.tracker.cancel();
        }
      }],
      update: {
        write: function () {
          if (this.isToggled() && !hasClass(this.$el, this.clsEnter)) {
            this.position();
          }
        },
        events: ['resize']
      },
      methods: {
        show: function (target, delay) {
          var this$1$1 = this;
          if (target === void 0) target = this.target;
          if (delay === void 0) delay = true;

          if (this.isToggled() && target && this.target && target !== this.target) {
            this.hide(false);
          }

          this.target = target;
          this.clearTimers();

          if (this.isActive()) {
            return;
          }

          if (active$1) {
            if (delay && active$1.isDelaying) {
              this.showTimer = setTimeout(this.show, 10);
              return;
            }

            var prev;

            while (active$1 && prev !== active$1 && !within(this.$el, active$1.$el)) {
              prev = active$1;
              active$1.hide(false);
            }
          }

          if (this.container && parent(this.$el) !== this.container) {
            append(this.container, this.$el);
          }

          this.showTimer = setTimeout(function () {
            return this$1$1.toggleElement(this$1$1.$el, true);
          }, delay && this.delayShow || 0);
        },
        hide: function (delay) {
          var this$1$1 = this;
          if (delay === void 0) delay = true;

          var hide = function () {
            return this$1$1.toggleElement(this$1$1.$el, false, false);
          };

          this.clearTimers();
          this.isDelaying = getPositionedElements(this.$el).some(function (el) {
            return this$1$1.tracker.movesTo(el);
          });

          if (delay && this.isDelaying) {
            this.hideTimer = setTimeout(this.hide, 50);
          } else if (delay && this.delayHide) {
            this.hideTimer = setTimeout(hide, this.delayHide);
          } else {
            hide();
          }
        },
        clearTimers: function () {
          clearTimeout(this.showTimer);
          clearTimeout(this.hideTimer);
          this.showTimer = null;
          this.hideTimer = null;
          this.isDelaying = false;
        },
        isActive: function () {
          return active$1 === this;
        },
        position: function () {
          removeClass(this.$el, this.clsDrop + "-stack");
          toggleClass(this.$el, this.clsDrop + "-boundary", this.boundaryAlign);
          var boundary = offset(this.boundary);
          var alignTo = this.boundaryAlign ? boundary : offset(this.target);

          if (this.align === 'justify') {
            var prop = this.getAxis() === 'y' ? 'width' : 'height';
            css(this.$el, prop, alignTo[prop]);
          } else if (this.boundary && this.$el.offsetWidth > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
            addClass(this.$el, this.clsDrop + "-stack");
          }

          this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.target, this.boundary);
        }
      }
    };

    function getPositionedElements(el) {
      var result = [];
      apply$1(el, function (el) {
        return css(el, 'position') !== 'static' && result.push(el);
      });
      return result;
    }

    var formCustom = {
      mixins: [Class],
      args: 'target',
      props: {
        target: Boolean
      },
      data: {
        target: false
      },
      computed: {
        input: function (_, $el) {
          return $(selInput, $el);
        },
        state: function () {
          return this.input.nextElementSibling;
        },
        target: function (ref, $el) {
          var target = ref.target;
          return target && (target === true && parent(this.input) === $el && this.input.nextElementSibling || query(target, $el));
        }
      },
      update: function () {
        var ref = this;
        var target = ref.target;
        var input = ref.input;

        if (!target) {
          return;
        }

        var option;
        var prop = isInput(target) ? 'value' : 'textContent';
        var prev = target[prop];
        var value = input.files && input.files[0] ? input.files[0].name : matches(input, 'select') && (option = $$('option', input).filter(function (el) {
          return el.selected;
        })[0]) // eslint-disable-line prefer-destructuring
        ? option.textContent : input.value;

        if (prev !== value) {
          target[prop] = value;
        }
      },
      events: [{
        name: 'change',
        handler: function () {
          this.$update();
        }
      }, {
        name: 'reset',
        el: function () {
          return closest(this.$el, 'form');
        },
        handler: function () {
          this.$update();
        }
      }]
    }; // Deprecated

    var gif = {
      update: {
        read: function (data) {
          var inview = isInView(this.$el);

          if (!inview || data.isInView === inview) {
            return false;
          }

          data.isInView = inview;
        },
        write: function () {
          this.$el.src = '' + this.$el.src; // force self-assign
        },
        events: ['scroll', 'resize']
      }
    };
    var Margin = {
      props: {
        margin: String,
        firstColumn: Boolean
      },
      data: {
        margin: 'uk-margin-small-top',
        firstColumn: 'uk-first-column'
      },
      update: {
        read: function () {
          var rows = getRows(this.$el.children);
          return {
            rows: rows,
            columns: getColumns(rows)
          };
        },
        write: function (ref) {
          var columns = ref.columns;
          var rows = ref.rows;

          for (var i = 0; i < rows.length; i++) {
            for (var j = 0; j < rows[i].length; j++) {
              toggleClass(rows[i][j], this.margin, i !== 0);
              toggleClass(rows[i][j], this.firstColumn, !!~columns[0].indexOf(rows[i][j]));
            }
          }
        },
        events: ['resize']
      }
    };

    function getRows(items) {
      return sortBy(items, 'top', 'bottom');
    }

    function getColumns(rows) {
      var columns = [];

      for (var i = 0; i < rows.length; i++) {
        var sorted = sortBy(rows[i], 'left', 'right');

        for (var j = 0; j < sorted.length; j++) {
          columns[j] = !columns[j] ? sorted[j] : columns[j].concat(sorted[j]);
        }
      }

      return isRtl ? columns.reverse() : columns;
    }

    function sortBy(items, startProp, endProp) {
      var sorted = [[]];

      for (var i = 0; i < items.length; i++) {
        var el = items[i];

        if (!isVisible(el)) {
          continue;
        }

        var dim = getOffset(el);

        for (var j = sorted.length - 1; j >= 0; j--) {
          var current = sorted[j];

          if (!current[0]) {
            current.push(el);
            break;
          }

          var startDim = void 0;

          if (current[0].offsetParent === el.offsetParent) {
            startDim = getOffset(current[0]);
          } else {
            dim = getOffset(el, true);
            startDim = getOffset(current[0], true);
          }

          if (dim[startProp] >= startDim[endProp] - 1 && dim[startProp] !== startDim[startProp]) {
            sorted.push([el]);
            break;
          }

          if (dim[endProp] - 1 > startDim[startProp] || dim[startProp] === startDim[startProp]) {
            current.push(el);
            break;
          }

          if (j === 0) {
            sorted.unshift([el]);
            break;
          }
        }
      }

      return sorted;
    }

    function getOffset(element, offset) {
      var assign;
      if (offset === void 0) offset = false;
      var offsetTop = element.offsetTop;
      var offsetLeft = element.offsetLeft;
      var offsetHeight = element.offsetHeight;
      var offsetWidth = element.offsetWidth;

      if (offset) {
        assign = offsetPosition(element), offsetTop = assign[0], offsetLeft = assign[1];
      }

      return {
        top: offsetTop,
        left: offsetLeft,
        bottom: offsetTop + offsetHeight,
        right: offsetLeft + offsetWidth
      };
    }

    var grid = {
      extends: Margin,
      mixins: [Class],
      name: 'grid',
      props: {
        masonry: Boolean,
        parallax: Number
      },
      data: {
        margin: 'uk-grid-margin',
        clsStack: 'uk-grid-stack',
        masonry: false,
        parallax: 0
      },
      connected: function () {
        this.masonry && addClass(this.$el, 'uk-flex-top uk-flex-wrap-top');
      },
      update: [{
        write: function (ref) {
          var columns = ref.columns;
          toggleClass(this.$el, this.clsStack, columns.length < 2);
        },
        events: ['resize']
      }, {
        read: function (data) {
          var columns = data.columns;
          var rows = data.rows; // Filter component makes elements positioned absolute

          if (!columns.length || !this.masonry && !this.parallax || positionedAbsolute(this.$el)) {
            data.translates = false;
            return false;
          }

          var translates = false;
          var nodes = children(this.$el);
          var columnHeights = getColumnHeights(columns);
          var margin = getMarginTop(nodes, this.margin) * (rows.length - 1);
          var elHeight = Math.max.apply(Math, columnHeights) + margin;

          if (this.masonry) {
            columns = columns.map(function (column) {
              return sortBy$1(column, 'offsetTop');
            });
            translates = getTranslates(rows, columns);
          }

          var padding = Math.abs(this.parallax);

          if (padding) {
            padding = columnHeights.reduce(function (newPadding, hgt, i) {
              return Math.max(newPadding, hgt + margin + (i % 2 ? padding : padding / 8) - elHeight);
            }, 0);
          }

          return {
            padding: padding,
            columns: columns,
            translates: translates,
            height: translates ? elHeight : ''
          };
        },
        write: function (ref) {
          var height = ref.height;
          var padding = ref.padding;
          css(this.$el, 'paddingBottom', padding || '');
          height !== false && css(this.$el, 'height', height);
        },
        events: ['resize']
      }, {
        read: function (ref) {
          var height$1 = ref.height;

          if (positionedAbsolute(this.$el)) {
            return false;
          }

          return {
            scrolled: this.parallax ? scrolledOver(this.$el, height$1 ? height$1 - height(this.$el) : 0) * Math.abs(this.parallax) : false
          };
        },
        write: function (ref) {
          var columns = ref.columns;
          var scrolled = ref.scrolled;
          var translates = ref.translates;

          if (scrolled === false && !translates) {
            return;
          }

          columns.forEach(function (column, i) {
            return column.forEach(function (el, j) {
              return css(el, 'transform', !scrolled && !translates ? '' : "translateY(" + ((translates && -translates[i][j]) + (scrolled ? i % 2 ? scrolled : scrolled / 8 : 0)) + "px)");
            });
          });
        },
        events: ['scroll', 'resize']
      }]
    };

    function positionedAbsolute(el) {
      return children(el).some(function (el) {
        return css(el, 'position') === 'absolute';
      });
    }

    function getTranslates(rows, columns) {
      var rowHeights = rows.map(function (row) {
        return Math.max.apply(Math, row.map(function (el) {
          return el.offsetHeight;
        }));
      });
      return columns.map(function (elements) {
        var prev = 0;
        return elements.map(function (element, row) {
          return prev += row ? rowHeights[row - 1] - elements[row - 1].offsetHeight : 0;
        });
      });
    }

    function getMarginTop(nodes, cls) {
      var ref = nodes.filter(function (el) {
        return hasClass(el, cls);
      });
      var node = ref[0];
      return toFloat(node ? css(node, 'marginTop') : css(nodes[0], 'paddingLeft'));
    }

    function getColumnHeights(columns) {
      return columns.map(function (column) {
        return column.reduce(function (sum, el) {
          return sum + el.offsetHeight;
        }, 0);
      });
    } // IE 11 fix (min-height on a flex container won't apply to its flex items)


    var FlexBug = isIE ? {
      props: {
        selMinHeight: String
      },
      data: {
        selMinHeight: false,
        forceHeight: false
      },
      computed: {
        elements: function (ref, $el) {
          var selMinHeight = ref.selMinHeight;
          return selMinHeight ? $$(selMinHeight, $el) : [$el];
        }
      },
      update: [{
        read: function () {
          css(this.elements, 'height', '');
        },
        order: -5,
        events: ['resize']
      }, {
        write: function () {
          var this$1$1 = this;
          this.elements.forEach(function (el) {
            var height = toFloat(css(el, 'minHeight'));

            if (height && (this$1$1.forceHeight || Math.round(height + boxModelAdjust(el, 'height', 'content-box')) >= el.offsetHeight)) {
              css(el, 'height', height);
            }
          });
        },
        order: 5,
        events: ['resize']
      }]
    } : {};
    var heightMatch = {
      mixins: [FlexBug],
      args: 'target',
      props: {
        target: String,
        row: Boolean
      },
      data: {
        target: '> *',
        row: true,
        forceHeight: true
      },
      computed: {
        elements: function (ref, $el) {
          var target = ref.target;
          return $$(target, $el);
        }
      },
      update: {
        read: function () {
          return {
            rows: (this.row ? getRows(this.elements) : [this.elements]).map(match$1)
          };
        },
        write: function (ref) {
          var rows = ref.rows;
          rows.forEach(function (ref) {
            var heights = ref.heights;
            var elements = ref.elements;
            return elements.forEach(function (el, i) {
              return css(el, 'minHeight', heights[i]);
            });
          });
        },
        events: ['resize']
      }
    };

    function match$1(elements) {
      if (elements.length < 2) {
        return {
          heights: [''],
          elements: elements
        };
      }

      var heights = elements.map(getHeight);
      var max = Math.max.apply(Math, heights);
      var hasMinHeight = elements.some(function (el) {
        return el.style.minHeight;
      });
      var hasShrunk = elements.some(function (el, i) {
        return !el.style.minHeight && heights[i] < max;
      });

      if (hasMinHeight && hasShrunk) {
        css(elements, 'minHeight', '');
        heights = elements.map(getHeight);
        max = Math.max.apply(Math, heights);
      }

      heights = elements.map(function (el, i) {
        return heights[i] === max && toFloat(el.style.minHeight).toFixed(2) !== max.toFixed(2) ? '' : max;
      });
      return {
        heights: heights,
        elements: elements
      };
    }

    function getHeight(element) {
      var style = false;

      if (!isVisible(element)) {
        style = element.style.display;
        css(element, 'display', 'block', 'important');
      }

      var height = dimensions(element).height - boxModelAdjust(element, 'height', 'content-box');

      if (style !== false) {
        css(element, 'display', style);
      }

      return height;
    }

    var heightViewport = {
      mixins: [FlexBug],
      props: {
        expand: Boolean,
        offsetTop: Boolean,
        offsetBottom: Boolean,
        minHeight: Number
      },
      data: {
        expand: false,
        offsetTop: false,
        offsetBottom: false,
        minHeight: 0
      },
      update: {
        read: function (ref) {
          var prev = ref.minHeight;

          if (!isVisible(this.$el)) {
            return false;
          }

          var minHeight = '';
          var box = boxModelAdjust(this.$el, 'height', 'content-box');

          if (this.expand) {
            minHeight = height(window) - (dimensions(document.documentElement).height - dimensions(this.$el).height) - box || '';
          } else {
            // on mobile devices (iOS and Android) window.innerHeight !== 100vh
            minHeight = 'calc(100vh';

            if (this.offsetTop) {
              var ref$1 = offset(this.$el);
              var top = ref$1.top;
              minHeight += top > 0 && top < height(window) / 2 ? " - " + top + "px" : '';
            }

            if (this.offsetBottom === true) {
              minHeight += " - " + dimensions(this.$el.nextElementSibling).height + "px";
            } else if (isNumeric(this.offsetBottom)) {
              minHeight += " - " + this.offsetBottom + "vh";
            } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {
              minHeight += " - " + toFloat(this.offsetBottom) + "px";
            } else if (isString(this.offsetBottom)) {
              minHeight += " - " + dimensions(query(this.offsetBottom, this.$el)).height + "px";
            }

            minHeight += (box ? " - " + box + "px" : '') + ")";
          }

          return {
            minHeight: minHeight,
            prev: prev
          };
        },
        write: function (ref) {
          var minHeight = ref.minHeight;
          var prev = ref.prev;
          css(this.$el, {
            minHeight: minHeight
          });

          if (minHeight !== prev) {
            this.$update(this.$el, 'resize');
          }

          if (this.minHeight && toFloat(css(this.$el, 'minHeight')) < this.minHeight) {
            css(this.$el, 'minHeight', this.minHeight);
          }
        },
        events: ['resize']
      }
    };
    var SVG = {
      args: 'src',
      props: {
        id: Boolean,
        icon: String,
        src: String,
        style: String,
        width: Number,
        height: Number,
        ratio: Number,
        class: String,
        strokeAnimation: Boolean,
        focusable: Boolean,
        // IE 11
        attributes: 'list'
      },
      data: {
        ratio: 1,
        include: ['style', 'class', 'focusable'],
        class: '',
        strokeAnimation: false
      },
      beforeConnect: function () {
        this.class += ' uk-svg';
      },
      connected: function () {
        var this$1$1 = this;
        var assign;

        if (!this.icon && includes(this.src, '#')) {
          assign = this.src.split('#'), this.src = assign[0], this.icon = assign[1];
        }

        this.svg = this.getSvg().then(function (el) {
          if (this$1$1._connected) {
            var svg = insertSVG(el, this$1$1.$el);

            if (this$1$1.svgEl && svg !== this$1$1.svgEl) {
              remove$1(this$1$1.svgEl);
            }

            this$1$1.applyAttributes(svg, el);
            this$1$1.$emit();
            return this$1$1.svgEl = svg;
          }
        }, noop);
      },
      disconnected: function () {
        var this$1$1 = this;
        this.svg.then(function (svg) {
          if (!this$1$1._connected) {
            if (isVoidElement(this$1$1.$el)) {
              this$1$1.$el.hidden = false;
            }

            remove$1(svg);
            this$1$1.svgEl = null;
          }
        });
        this.svg = null;
      },
      update: {
        read: function () {
          return !!(this.strokeAnimation && this.svgEl && isVisible(this.svgEl));
        },
        write: function () {
          applyAnimation(this.svgEl);
        },
        type: ['resize']
      },
      methods: {
        getSvg: function () {
          var this$1$1 = this;
          return loadSVG(this.src).then(function (svg) {
            return parseSVG(svg, this$1$1.icon) || Promise$1.reject('SVG not found.');
          });
        },
        applyAttributes: function (el, ref) {
          var this$1$1 = this;

          for (var prop in this.$options.props) {
            if (includes(this.include, prop) && prop in this) {
              attr(el, prop, this[prop]);
            }
          }

          for (var attribute in this.attributes) {
            var ref$1 = this.attributes[attribute].split(':', 2);
            var prop$1 = ref$1[0];
            var value = ref$1[1];
            attr(el, prop$1, value);
          }

          if (!this.id) {
            removeAttr(el, 'id');
          }

          var props = ['width', 'height'];
          var dimensions = props.map(function (prop) {
            return this$1$1[prop];
          });

          if (!dimensions.some(function (val) {
            return val;
          })) {
            dimensions = props.map(function (prop) {
              return attr(ref, prop);
            });
          }

          var viewBox = attr(ref, 'viewBox');

          if (viewBox && !dimensions.some(function (val) {
            return val;
          })) {
            dimensions = viewBox.split(' ').slice(2);
          }

          dimensions.forEach(function (val, i) {
            return attr(el, props[i], toFloat(val) * this$1$1.ratio || null);
          });
        }
      }
    };
    var loadSVG = memoize(function (src) {
      return new Promise$1(function (resolve, reject) {
        if (!src) {
          reject();
          return;
        }

        if (startsWith(src, 'data:')) {
          resolve(decodeURIComponent(src.split(',')[1]));
        } else {
          ajax(src).then(function (xhr) {
            return resolve(xhr.response);
          }, function () {
            return reject('SVG not found.');
          });
        }
      });
    });

    function parseSVG(svg, icon) {
      if (icon && includes(svg, '<symbol')) {
        svg = parseSymbols(svg, icon) || svg;
      }

      svg = $(svg.substr(svg.indexOf('<svg')));
      return svg && svg.hasChildNodes() && svg;
    }

    var symbolRe = /<symbol([^]*?id=(['"])(.+?)\2[^]*?<\/)symbol>/g;
    var symbols = {};

    function parseSymbols(svg, icon) {
      if (!symbols[svg]) {
        symbols[svg] = {};
        symbolRe.lastIndex = 0;
        var match;

        while (match = symbolRe.exec(svg)) {
          symbols[svg][match[3]] = "<svg xmlns=\"http://www.w3.org/2000/svg\"" + match[1] + "svg>";
        }
      }

      return symbols[svg][icon];
    }

    function applyAnimation(el) {
      var length = getMaxPathLength(el);

      if (length) {
        el.style.setProperty('--uk-animation-stroke', length);
      }
    }

    function getMaxPathLength(el) {
      return Math.ceil(Math.max.apply(Math, [0].concat($$('[stroke]', el).map(function (stroke) {
        try {
          return stroke.getTotalLength();
        } catch (e) {
          return 0;
        }
      }))));
    }

    function insertSVG(el, root) {
      if (isVoidElement(root) || root.tagName === 'CANVAS') {
        root.hidden = true;
        var next = root.nextElementSibling;
        return equals(el, next) ? next : after(root, el);
      }

      var last = root.lastElementChild;
      return equals(el, last) ? last : append(root, el);
    }

    function equals(el, other) {
      return isSVG(el) && isSVG(other) && innerHTML(el) === innerHTML(other);
    }

    function isSVG(el) {
      return el && el.tagName === 'svg';
    }

    function innerHTML(el) {
      return (el.innerHTML || new XMLSerializer().serializeToString(el).replace(/<svg.*?>(.*?)<\/svg>/g, '$1')).replace(/\s/g, '');
    }

    var closeIcon = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"1\" y1=\"1\" x2=\"13\" y2=\"13\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"13\" y1=\"1\" x2=\"1\" y2=\"13\"/></svg>";
    var closeLarge = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"1\" y1=\"1\" x2=\"19\" y2=\"19\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"19\" y1=\"1\" x2=\"1\" y2=\"19\"/></svg>";
    var marker = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"9\" y=\"4\" width=\"1\" height=\"11\"/><rect x=\"4\" y=\"9\" width=\"11\" height=\"1\"/></svg>";
    var navbarToggleIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect y=\"9\" width=\"20\" height=\"2\"/><rect y=\"3\" width=\"20\" height=\"2\"/><rect y=\"15\" width=\"20\" height=\"2\"/></svg>";
    var overlayIcon = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"19\" y=\"0\" width=\"1\" height=\"40\"/><rect x=\"0\" y=\"19\" width=\"40\" height=\"1\"/></svg>";
    var paginationNext = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 1 6 6 1 11\"/></svg>";
    var paginationPrevious = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"6 1 1 6 6 11\"/></svg>";
    var searchIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9\" cy=\"9\" r=\"7\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M14,14 L18,18 L14,14 Z\"/></svg>";
    var searchLarge = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" cx=\"17.5\" cy=\"17.5\" r=\"16.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" x1=\"38\" y1=\"39\" x2=\"29\" y2=\"30\"/></svg>";
    var searchNavbar = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10.5\" cy=\"10.5\" r=\"9.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"23\" y1=\"23\" x2=\"17\" y2=\"17\"/></svg>";
    var slidenavNext = "<svg width=\"14\" height=\"24\" viewBox=\"0 0 14 24\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"1.225,23 12.775,12 1.225,1 \"/></svg>";
    var slidenavNextLarge = "<svg width=\"25\" height=\"40\" viewBox=\"0 0 25 40\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"2\" points=\"4.002,38.547 22.527,20.024 4,1.5 \"/></svg>";
    var slidenavPrevious = "<svg width=\"14\" height=\"24\" viewBox=\"0 0 14 24\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"12.775,1 1.225,12 12.775,23 \"/></svg>";
    var slidenavPreviousLarge = "<svg width=\"25\" height=\"40\" viewBox=\"0 0 25 40\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"2\" points=\"20.527,1.5 2,20.024 20.525,38.547 \"/></svg>";
    var spinner = "<svg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" cx=\"15\" cy=\"15\" r=\"14\"/></svg>";
    var totop = "<svg width=\"18\" height=\"10\" viewBox=\"0 0 18 10\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 9 9 1 17 9 \"/></svg>";
    var icons = {
      spinner: spinner,
      totop: totop,
      marker: marker,
      'close-icon': closeIcon,
      'close-large': closeLarge,
      'navbar-toggle-icon': navbarToggleIcon,
      'overlay-icon': overlayIcon,
      'pagination-next': paginationNext,
      'pagination-previous': paginationPrevious,
      'search-icon': searchIcon,
      'search-large': searchLarge,
      'search-navbar': searchNavbar,
      'slidenav-next': slidenavNext,
      'slidenav-next-large': slidenavNextLarge,
      'slidenav-previous': slidenavPrevious,
      'slidenav-previous-large': slidenavPreviousLarge
    };
    var Icon = {
      install: install$3,
      extends: SVG,
      args: 'icon',
      props: ['icon'],
      data: {
        include: ['focusable']
      },
      isIcon: true,
      beforeConnect: function () {
        addClass(this.$el, 'uk-icon');
      },
      methods: {
        getSvg: function () {
          var icon = getIcon(this.icon);

          if (!icon) {
            return Promise$1.reject('Icon not found.');
          }

          return Promise$1.resolve(icon);
        }
      }
    };
    var IconComponent = {
      args: false,
      extends: Icon,
      data: function (vm) {
        return {
          icon: hyphenate(vm.constructor.options.name)
        };
      },
      beforeConnect: function () {
        addClass(this.$el, this.$name);
      }
    };
    var Slidenav = {
      extends: IconComponent,
      beforeConnect: function () {
        addClass(this.$el, 'uk-slidenav');
      },
      computed: {
        icon: function (ref, $el) {
          var icon = ref.icon;
          return hasClass($el, 'uk-slidenav-large') ? icon + "-large" : icon;
        }
      }
    };
    var Search = {
      extends: IconComponent,
      computed: {
        icon: function (ref, $el) {
          var icon = ref.icon;
          return hasClass($el, 'uk-search-icon') && parents($el, '.uk-search-large').length ? 'search-large' : parents($el, '.uk-search-navbar').length ? 'search-navbar' : icon;
        }
      }
    };
    var Close = {
      extends: IconComponent,
      computed: {
        icon: function () {
          return "close-" + (hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon');
        }
      }
    };
    var Spinner = {
      extends: IconComponent,
      connected: function () {
        var this$1$1 = this;
        this.svg.then(function (svg) {
          return svg && this$1$1.ratio !== 1 && css($('circle', svg), 'strokeWidth', 1 / this$1$1.ratio);
        });
      }
    };
    var parsed = {};

    function install$3(UIkit) {
      UIkit.icon.add = function (name, svg) {
        var obj;
        var added = isString(name) ? (obj = {}, obj[name] = svg, obj) : name;
        each(added, function (svg, name) {
          icons[name] = svg;
          delete parsed[name];
        });

        if (UIkit._initialized) {
          apply$1(document.body, function (el) {
            return each(UIkit.getComponents(el), function (cmp) {
              cmp.$options.isIcon && cmp.icon in added && cmp.$reset();
            });
          });
        }
      };
    }

    function getIcon(icon) {
      if (!icons[icon]) {
        return null;
      }

      if (!parsed[icon]) {
        parsed[icon] = $((icons[applyRtl(icon)] || icons[icon]).trim());
      }

      return parsed[icon].cloneNode(true);
    }

    function applyRtl(icon) {
      return isRtl ? swap(swap(icon, 'left', 'right'), 'previous', 'next') : icon;
    }

    var img = {
      args: 'dataSrc',
      props: {
        dataSrc: String,
        dataSrcset: Boolean,
        sizes: String,
        width: Number,
        height: Number,
        offsetTop: String,
        offsetLeft: String,
        target: String
      },
      data: {
        dataSrc: '',
        dataSrcset: false,
        sizes: false,
        width: false,
        height: false,
        offsetTop: '50vh',
        offsetLeft: '50vw',
        target: false
      },
      computed: {
        cacheKey: function (ref) {
          var dataSrc = ref.dataSrc;
          return this.$name + "." + dataSrc;
        },
        width: function (ref) {
          var width = ref.width;
          var dataWidth = ref.dataWidth;
          return width || dataWidth;
        },
        height: function (ref) {
          var height = ref.height;
          var dataHeight = ref.dataHeight;
          return height || dataHeight;
        },
        sizes: function (ref) {
          var sizes = ref.sizes;
          var dataSizes = ref.dataSizes;
          return sizes || dataSizes;
        },
        isImg: function (_, $el) {
          return isImg($el);
        },
        target: {
          get: function (ref) {
            var target = ref.target;
            return [this.$el].concat(queryAll(target, this.$el));
          },
          watch: function () {
            this.observe();
          }
        },
        offsetTop: function (ref) {
          var offsetTop = ref.offsetTop;
          return toPx(offsetTop, 'height');
        },
        offsetLeft: function (ref) {
          var offsetLeft = ref.offsetLeft;
          return toPx(offsetLeft, 'width');
        }
      },
      connected: function () {
        if (!window.IntersectionObserver) {
          setSrcAttrs(this.$el, this.dataSrc, this.dataSrcset, this.sizes);
          return;
        }

        if (storage[this.cacheKey]) {
          setSrcAttrs(this.$el, storage[this.cacheKey], this.dataSrcset, this.sizes);
        } else if (this.isImg && this.width && this.height) {
          setSrcAttrs(this.$el, getPlaceholderImage(this.width, this.height, this.sizes));
        }

        this.observer = new IntersectionObserver(this.load, {
          rootMargin: this.offsetTop + "px " + this.offsetLeft + "px"
        });
        requestAnimationFrame(this.observe);
      },
      disconnected: function () {
        this.observer && this.observer.disconnect();
      },
      update: {
        read: function (ref) {
          var this$1$1 = this;
          var image = ref.image;

          if (!this.observer) {
            return false;
          }

          if (!image && document.readyState === 'complete') {
            this.load(this.observer.takeRecords());
          }

          if (this.isImg) {
            return false;
          }

          image && image.then(function (img) {
            return img && img.currentSrc !== '' && setSrcAttrs(this$1$1.$el, currentSrc(img));
          });
        },
        write: function (data) {
          if (this.dataSrcset && window.devicePixelRatio !== 1) {
            var bgSize = css(this.$el, 'backgroundSize');

            if (bgSize.match(/^(auto\s?)+$/) || toFloat(bgSize) === data.bgSize) {
              data.bgSize = getSourceSize(this.dataSrcset, this.sizes);
              css(this.$el, 'backgroundSize', data.bgSize + "px");
            }
          }
        },
        events: ['resize']
      },
      methods: {
        load: function (entries) {
          var this$1$1 = this; // Old chromium based browsers (UC Browser) did not implement `isIntersecting`

          if (!entries.some(function (entry) {
            return isUndefined(entry.isIntersecting) || entry.isIntersecting;
          })) {
            return;
          }

          this._data.image = getImage(this.dataSrc, this.dataSrcset, this.sizes).then(function (img) {
            setSrcAttrs(this$1$1.$el, currentSrc(img), img.srcset, img.sizes);
            storage[this$1$1.cacheKey] = currentSrc(img);
            return img;
          }, function (e) {
            return trigger(this$1$1.$el, new e.constructor(e.type, e));
          });
          this.observer.disconnect();
        },
        observe: function () {
          var this$1$1 = this;

          if (this._connected && !this._data.image) {
            this.target.forEach(function (el) {
              return this$1$1.observer.observe(el);
            });
          }
        }
      }
    };

    function setSrcAttrs(el, src, srcset, sizes) {
      if (isImg(el)) {
        var set = function (prop, val) {
          return val && val !== el[prop] && (el[prop] = val);
        };

        set('sizes', sizes);
        set('srcset', srcset);
        set('src', src);
      } else if (src) {
        var change = !includes(el.style.backgroundImage, src);

        if (change) {
          css(el, 'backgroundImage', "url(" + escape(src) + ")");
          trigger(el, createEvent('load', false));
        }
      }
    }

    function getPlaceholderImage(width, height, sizes) {
      var assign;

      if (sizes) {
        assign = Dimensions.ratio({
          width: width,
          height: height
        }, 'width', toPx(sizesToPixel(sizes))), width = assign.width, height = assign.height;
      }

      return "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width + "\" height=\"" + height + "\"></svg>";
    }

    var sizesRe = /\s*(.*?)\s*(\w+|calc\(.*?\))\s*(?:,|$)/g;

    function sizesToPixel(sizes) {
      var matches;
      sizesRe.lastIndex = 0;

      while (matches = sizesRe.exec(sizes)) {
        if (!matches[1] || window.matchMedia(matches[1]).matches) {
          matches = evaluateSize(matches[2]);
          break;
        }
      }

      return matches || '100vw';
    }

    var sizeRe = /\d+(?:\w+|%)/g;
    var additionRe = /[+-]?(\d+)/g;

    function evaluateSize(size) {
      return startsWith(size, 'calc') ? size.slice(5, -1).replace(sizeRe, function (size) {
        return toPx(size);
      }).replace(/ /g, '').match(additionRe).reduce(function (a, b) {
        return a + +b;
      }, 0) : size;
    }

    var srcSetRe = /\s+\d+w\s*(?:,|$)/g;

    function getSourceSize(srcset, sizes) {
      var srcSize = toPx(sizesToPixel(sizes));
      var descriptors = (srcset.match(srcSetRe) || []).map(toFloat).sort(function (a, b) {
        return a - b;
      });
      return descriptors.filter(function (size) {
        return size >= srcSize;
      })[0] || descriptors.pop() || '';
    }

    function isImg(el) {
      return el.tagName === 'IMG';
    }

    function currentSrc(el) {
      return el.currentSrc || el.src;
    }

    var key = '__test__';
    var storage; // workaround for Safari's private browsing mode and accessing sessionStorage in Blink

    try {
      storage = window.sessionStorage || {};
      storage[key] = 1;
      delete storage[key];
    } catch (e) {
      storage = {};
    }

    var Media = {
      props: {
        media: Boolean
      },
      data: {
        media: false
      },
      computed: {
        matchMedia: function () {
          var media = toMedia(this.media);
          return !media || window.matchMedia(media).matches;
        }
      }
    };

    function toMedia(value) {
      if (isString(value)) {
        if (value[0] === '@') {
          var name = "breakpoint-" + value.substr(1);
          value = toFloat(getCssVar(name));
        } else if (isNaN(value)) {
          return value;
        }
      }

      return value && !isNaN(value) ? "(min-width: " + value + "px)" : false;
    }

    var leader = {
      mixins: [Class, Media],
      props: {
        fill: String
      },
      data: {
        fill: '',
        clsWrapper: 'uk-leader-fill',
        clsHide: 'uk-leader-hide',
        attrFill: 'data-fill'
      },
      computed: {
        fill: function (ref) {
          var fill = ref.fill;
          return fill || getCssVar('leader-fill-content');
        }
      },
      connected: function () {
        var assign;
        assign = wrapInner(this.$el, "<span class=\"" + this.clsWrapper + "\">"), this.wrapper = assign[0];
      },
      disconnected: function () {
        unwrap(this.wrapper.childNodes);
      },
      update: {
        read: function (ref) {
          var changed = ref.changed;
          var width = ref.width;
          var prev = width;
          width = Math.floor(this.$el.offsetWidth / 2);
          return {
            width: width,
            fill: this.fill,
            changed: changed || prev !== width,
            hide: !this.matchMedia
          };
        },
        write: function (data) {
          toggleClass(this.wrapper, this.clsHide, data.hide);

          if (data.changed) {
            data.changed = false;
            attr(this.wrapper, this.attrFill, new Array(data.width).join(data.fill));
          }
        },
        events: ['resize']
      }
    };
    var active = [];
    var Modal = {
      mixins: [Class, Container, Togglable],
      props: {
        selPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean
      },
      data: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false
      },
      computed: {
        panel: function (ref, $el) {
          var selPanel = ref.selPanel;
          return $(selPanel, $el);
        },
        transitionElement: function () {
          return this.panel;
        },
        bgClose: function (ref) {
          var bgClose = ref.bgClose;
          return bgClose && this.panel;
        }
      },
      beforeDisconnect: function () {
        if (includes(active, this)) {
          this.toggleElement(this.$el, false, false);
        }
      },
      events: [{
        name: 'click',
        delegate: function () {
          return this.selClose;
        },
        handler: function (e) {
          e.preventDefault();
          this.hide();
        }
      }, {
        name: 'toggle',
        self: true,
        handler: function (e, toggle) {
          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();

          if (this.isToggled() === includes(active, this)) {
            this.toggle();
          }
        }
      }, {
        name: 'beforeshow',
        self: true,
        handler: function (e) {
          if (includes(active, this)) {
            return false;
          }

          if (!this.stack && active.length) {
            Promise$1.all(active.map(function (modal) {
              return modal.hide();
            })).then(this.show);
            e.preventDefault();
          } else {
            active.push(this);
          }
        }
      }, {
        name: 'show',
        self: true,
        handler: function () {
          var this$1$1 = this;
          var docEl = document.documentElement;

          if (width(window) > docEl.clientWidth && this.overlay) {
            css(document.body, 'overflowY', 'scroll');
          }

          if (this.stack) {
            css(this.$el, 'zIndex', toFloat(css(this.$el, 'zIndex')) + active.length);
          }

          addClass(docEl, this.clsPage);

          if (this.bgClose) {
            once(this.$el, 'hide', on(document, pointerDown, function (ref) {
              var target = ref.target;

              if (last(active) !== this$1$1 || this$1$1.overlay && !within(target, this$1$1.$el) || within(target, this$1$1.panel)) {
                return;
              }

              once(document, pointerUp + " " + pointerCancel + " scroll", function (ref) {
                var defaultPrevented = ref.defaultPrevented;
                var type = ref.type;
                var newTarget = ref.target;

                if (!defaultPrevented && type === pointerUp && target === newTarget) {
                  this$1$1.hide();
                }
              }, true);
            }), {
              self: true
            });
          }

          if (this.escClose) {
            once(this.$el, 'hide', on(document, 'keydown', function (e) {
              if (e.keyCode === 27 && last(active) === this$1$1) {
                this$1$1.hide();
              }
            }), {
              self: true
            });
          }
        }
      }, {
        name: 'shown',
        self: true,
        handler: function () {
          if (!isFocusable(this.$el)) {
            attr(this.$el, 'tabindex', '-1');
          }

          if (!$(':focus', this.$el)) {
            this.$el.focus();
          }
        }
      }, {
        name: 'hidden',
        self: true,
        handler: function () {
          var this$1$1 = this;

          if (includes(active, this)) {
            active.splice(active.indexOf(this), 1);
          }

          if (!active.length) {
            css(document.body, 'overflowY', '');
          }

          css(this.$el, 'zIndex', '');

          if (!active.some(function (modal) {
            return modal.clsPage === this$1$1.clsPage;
          })) {
            removeClass(document.documentElement, this.clsPage);
          }
        }
      }],
      methods: {
        toggle: function () {
          return this.isToggled() ? this.hide() : this.show();
        },
        show: function () {
          var this$1$1 = this;

          if (this.container && parent(this.$el) !== this.container) {
            append(this.container, this.$el);
            return new Promise$1(function (resolve) {
              return requestAnimationFrame(function () {
                return this$1$1.show().then(resolve);
              });
            });
          }

          return this.toggleElement(this.$el, true, animate(this));
        },
        hide: function () {
          return this.toggleElement(this.$el, false, animate(this));
        }
      }
    };

    function animate(ref) {
      var transitionElement = ref.transitionElement;
      var _toggle = ref._toggle;
      return function (el, show) {
        return new Promise$1(function (resolve, reject) {
          return once(el, 'show hide', function () {
            el._reject && el._reject();
            el._reject = reject;

            _toggle(el, show);

            var off = once(transitionElement, 'transitionstart', function () {
              once(transitionElement, 'transitionend transitioncancel', resolve, {
                self: true
              });
              clearTimeout(timer);
            }, {
              self: true
            });
            var timer = setTimeout(function () {
              off();
              resolve();
            }, toMs(css(transitionElement, 'transitionDuration')));
          });
        }).then(function () {
          return delete el._reject;
        });
      };
    }

    var modal = {
      install: install$2,
      mixins: [Modal],
      data: {
        clsPage: 'uk-modal-page',
        selPanel: '.uk-modal-dialog',
        selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full'
      },
      events: [{
        name: 'show',
        self: true,
        handler: function () {
          if (hasClass(this.panel, 'uk-margin-auto-vertical')) {
            addClass(this.$el, 'uk-flex');
          } else {
            css(this.$el, 'display', 'block');
          }

          height(this.$el); // force reflow
        }
      }, {
        name: 'hidden',
        self: true,
        handler: function () {
          css(this.$el, 'display', '');
          removeClass(this.$el, 'uk-flex');
        }
      }]
    };

    function install$2(ref) {
      var modal = ref.modal;

      modal.dialog = function (content, options) {
        var dialog = modal("<div class=\"uk-modal\"> <div class=\"uk-modal-dialog\">" + content + "</div> </div>", options);
        dialog.show();
        on(dialog.$el, 'hidden', function () {
          return Promise$1.resolve().then(function () {
            return dialog.$destroy(true);
          });
        }, {
          self: true
        });
        return dialog;
      };

      modal.alert = function (message, options) {
        return openDialog(function (ref) {
          var labels = ref.labels;
          return "<div class=\"uk-modal-body\">" + (isString(message) ? message : html(message)) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + labels.ok + "</button> </div>";
        }, options, function (deferred) {
          return deferred.resolve();
        });
      };

      modal.confirm = function (message, options) {
        return openDialog(function (ref) {
          var labels = ref.labels;
          return "<form> <div class=\"uk-modal-body\">" + (isString(message) ? message : html(message)) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" + labels.cancel + "</button> <button class=\"uk-button uk-button-primary\" autofocus>" + labels.ok + "</button> </div> </form>";
        }, options, function (deferred) {
          return deferred.reject();
        });
      };

      modal.prompt = function (message, value, options) {
        return openDialog(function (ref) {
          var labels = ref.labels;
          return "<form class=\"uk-form-stacked\"> <div class=\"uk-modal-body\"> <label>" + (isString(message) ? message : html(message)) + "</label> <input class=\"uk-input\" value=\"" + (value || '') + "\" autofocus> </div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" + labels.cancel + "</button> <button class=\"uk-button uk-button-primary\">" + labels.ok + "</button> </div> </form>";
        }, options, function (deferred) {
          return deferred.resolve(null);
        }, function (dialog) {
          return $('input', dialog.$el).value;
        });
      };

      modal.labels = {
        ok: 'Ok',
        cancel: 'Cancel'
      };

      function openDialog(tmpl, options, hideFn, submitFn) {
        options = assign({
          bgClose: false,
          escClose: true,
          labels: modal.labels
        }, options);
        var dialog = modal.dialog(tmpl(options), options);
        var deferred = new Deferred();
        var resolved = false;
        on(dialog.$el, 'submit', 'form', function (e) {
          e.preventDefault();
          deferred.resolve(submitFn && submitFn(dialog));
          resolved = true;
          dialog.hide();
        });
        on(dialog.$el, 'hide', function () {
          return !resolved && hideFn(deferred);
        });
        deferred.promise.dialog = dialog;
        return deferred.promise;
      }
    }

    var nav = {
      extends: Accordion,
      data: {
        targets: '> .uk-parent',
        toggle: '> a',
        content: '> ul'
      }
    };
    var navItem = '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle';
    var navbar = {
      mixins: [Class, Container, FlexBug],
      props: {
        dropdown: String,
        mode: 'list',
        align: String,
        offset: Number,
        boundary: Boolean,
        boundaryAlign: Boolean,
        clsDrop: String,
        delayShow: Number,
        delayHide: Number,
        dropbar: Boolean,
        dropbarMode: String,
        dropbarAnchor: Boolean,
        duration: Number
      },
      data: {
        dropdown: navItem,
        align: !isRtl ? 'left' : 'right',
        clsDrop: 'uk-navbar-dropdown',
        mode: undefined,
        offset: undefined,
        delayShow: undefined,
        delayHide: undefined,
        boundaryAlign: undefined,
        flip: 'x',
        boundary: true,
        dropbar: false,
        dropbarMode: 'slide',
        dropbarAnchor: false,
        duration: 200,
        forceHeight: true,
        selMinHeight: navItem,
        container: false
      },
      computed: {
        boundary: function (ref, $el) {
          var boundary = ref.boundary;
          var boundaryAlign = ref.boundaryAlign;
          return boundary === true || boundaryAlign ? $el : boundary;
        },
        dropbarAnchor: function (ref, $el) {
          var dropbarAnchor = ref.dropbarAnchor;
          return query(dropbarAnchor, $el);
        },
        pos: function (ref) {
          var align = ref.align;
          return "bottom-" + align;
        },
        dropbar: {
          get: function (ref) {
            var dropbar = ref.dropbar;

            if (!dropbar) {
              return null;
            }

            dropbar = this._dropbar || query(dropbar, this.$el) || $('+ .uk-navbar-dropbar', this.$el);
            return dropbar ? dropbar : this._dropbar = $('<div></div>');
          },
          watch: function (dropbar) {
            addClass(dropbar, 'uk-navbar-dropbar');
          },
          immediate: true
        },
        dropContainer: function (_, $el) {
          return this.container || $el;
        },
        dropdowns: {
          get: function (ref, $el) {
            var this$1$1 = this;
            var clsDrop = ref.clsDrop;
            var dropdowns = $$("." + clsDrop, $el);

            if (this.dropContainer !== $el) {
              $$("." + clsDrop, this.dropContainer).forEach(function (el) {
                var dropdown = this$1$1.getDropdown(el);

                if (!includes(dropdowns, el) && dropdown && dropdown.target && within(dropdown.target, this$1$1.$el)) {
                  dropdowns.push(el);
                }
              });
            }

            return dropdowns;
          },
          watch: function (dropdowns) {
            var this$1$1 = this;
            this.$create('drop', dropdowns.filter(function (el) {
              return !this$1$1.getDropdown(el);
            }), assign({}, this.$props, {
              boundary: this.boundary,
              pos: this.pos,
              offset: this.dropbar || this.offset
            }));
          },
          immediate: true
        },
        toggles: function (ref, $el) {
          var dropdown = ref.dropdown;
          return $$(dropdown, $el);
        }
      },
      disconnected: function () {
        this.dropbar && remove$1(this.dropbar);
        delete this._dropbar;
      },
      events: [{
        name: 'mouseover focusin',
        delegate: function () {
          return this.dropdown;
        },
        handler: function (ref) {
          var current = ref.current;
          var active = this.getActive();

          if (active && includes(active.mode, 'hover') && active.target && !within(active.target, current) && !active.tracker.movesTo(active.$el)) {
            active.hide(false);
          }
        }
      }, {
        name: 'keydown',
        delegate: function () {
          return this.dropdown;
        },
        handler: function (e) {
          var current = e.current;
          var keyCode = e.keyCode;
          var active = this.getActive();

          if (keyCode === keyMap.DOWN && hasAttr(current, 'aria-expanded')) {
            e.preventDefault();

            if (!active || active.target !== current) {
              current.click();
              once(this.dropContainer, 'show', function (ref) {
                var target = ref.target;
                return focusFirstFocusableElement(target);
              });
            } else {
              focusFirstFocusableElement(active.$el);
            }
          }

          handleNavItemNavigation(e, this.toggles, active);
        }
      }, {
        name: 'keydown',
        el: function () {
          return this.dropContainer;
        },
        delegate: function () {
          return "." + this.clsDrop;
        },
        handler: function (e) {
          var current = e.current;
          var keyCode = e.keyCode;

          if (!includes(this.dropdowns, current)) {
            return;
          }

          var active = this.getActive();
          var elements = $$(selFocusable, current);
          var i = findIndex(elements, function (el) {
            return matches(el, ':focus');
          });

          if (keyCode === keyMap.UP) {
            e.preventDefault();

            if (i > 0) {
              elements[i - 1].focus();
            }
          }

          if (keyCode === keyMap.DOWN) {
            e.preventDefault();

            if (i < elements.length - 1) {
              elements[i + 1].focus();
            }
          }

          if (keyCode === keyMap.ESC) {
            active && active.target && active.target.focus();
          }

          handleNavItemNavigation(e, this.toggles, active);
        }
      }, {
        name: 'mouseleave',
        el: function () {
          return this.dropbar;
        },
        filter: function () {
          return this.dropbar;
        },
        handler: function () {
          var active = this.getActive();

          if (active && includes(active.mode, 'hover') && !this.dropdowns.some(function (el) {
            return matches(el, ':hover');
          })) {
            active.hide();
          }
        }
      }, {
        name: 'beforeshow',
        el: function () {
          return this.dropContainer;
        },
        filter: function () {
          return this.dropbar;
        },
        handler: function () {
          if (!parent(this.dropbar)) {
            after(this.dropbarAnchor || this.$el, this.dropbar);
          }
        }
      }, {
        name: 'show',
        el: function () {
          return this.dropContainer;
        },
        filter: function () {
          return this.dropbar;
        },
        handler: function (_, ref) {
          var $el = ref.$el;
          var dir = ref.dir;

          if (!hasClass($el, this.clsDrop)) {
            return;
          }

          if (this.dropbarMode === 'slide') {
            addClass(this.dropbar, 'uk-navbar-dropbar-slide');
          }

          this.clsDrop && addClass($el, this.clsDrop + "-dropbar");

          if (dir === 'bottom') {
            this.transitionTo($el.offsetHeight + toFloat(css($el, 'marginTop')) + toFloat(css($el, 'marginBottom')), $el);
          }
        }
      }, {
        name: 'beforehide',
        el: function () {
          return this.dropContainer;
        },
        filter: function () {
          return this.dropbar;
        },
        handler: function (e, ref) {
          var $el = ref.$el;
          var active = this.getActive();

          if (matches(this.dropbar, ':hover') && active && active.$el === $el) {
            e.preventDefault();
          }
        }
      }, {
        name: 'hide',
        el: function () {
          return this.dropContainer;
        },
        filter: function () {
          return this.dropbar;
        },
        handler: function (_, ref) {
          var $el = ref.$el;

          if (!hasClass($el, this.clsDrop)) {
            return;
          }

          var active = this.getActive();

          if (!active || active && active.$el === $el) {
            this.transitionTo(0);
          }
        }
      }],
      methods: {
        getActive: function () {
          return active$1 && within(active$1.target, this.$el) && active$1;
        },
        transitionTo: function (newHeight, el) {
          var this$1$1 = this;
          var ref = this;
          var dropbar = ref.dropbar;
          var oldHeight = isVisible(dropbar) ? height(dropbar) : 0;
          el = oldHeight < newHeight && el;
          css(el, 'clip', "rect(0," + el.offsetWidth + "px," + oldHeight + "px,0)");
          height(dropbar, oldHeight);
          Transition.cancel([el, dropbar]);
          return Promise$1.all([Transition.start(dropbar, {
            height: newHeight
          }, this.duration), Transition.start(el, {
            clip: "rect(0," + el.offsetWidth + "px," + newHeight + "px,0)"
          }, this.duration)]).catch(noop).then(function () {
            css(el, {
              clip: ''
            });
            this$1$1.$update(dropbar);
          });
        },
        getDropdown: function (el) {
          return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
        }
      }
    };

    function handleNavItemNavigation(e, toggles, active) {
      var current = e.current;
      var keyCode = e.keyCode;
      var target = active && active.target || current;
      var i = toggles.indexOf(target); // Left

      if (keyCode === keyMap.LEFT && i > 0) {
        active && active.hide(false);
        toggles[i - 1].focus();
      } // Right


      if (keyCode === keyMap.RIGHT && i < toggles.length - 1) {
        active && active.hide(false);
        toggles[i + 1].focus();
      }

      if (keyCode === keyMap.TAB) {
        target.focus();
        active && active.hide(false);
      }
    }

    function focusFirstFocusableElement(el) {
      if (!$(':focus', el)) {
        var focusEl = $(selFocusable, el);

        if (focusEl) {
          focusEl.focus();
        }
      }
    }

    var keyMap = {
      TAB: 9,
      ESC: 27,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    };
    var offcanvas = {
      mixins: [Modal],
      args: 'mode',
      props: {
        mode: String,
        flip: Boolean,
        overlay: Boolean
      },
      data: {
        mode: 'slide',
        flip: false,
        overlay: false,
        clsPage: 'uk-offcanvas-page',
        clsContainer: 'uk-offcanvas-container',
        selPanel: '.uk-offcanvas-bar',
        clsFlip: 'uk-offcanvas-flip',
        clsContainerAnimation: 'uk-offcanvas-container-animation',
        clsSidebarAnimation: 'uk-offcanvas-bar-animation',
        clsMode: 'uk-offcanvas',
        clsOverlay: 'uk-offcanvas-overlay',
        selClose: '.uk-offcanvas-close',
        container: false
      },
      computed: {
        clsFlip: function (ref) {
          var flip = ref.flip;
          var clsFlip = ref.clsFlip;
          return flip ? clsFlip : '';
        },
        clsOverlay: function (ref) {
          var overlay = ref.overlay;
          var clsOverlay = ref.clsOverlay;
          return overlay ? clsOverlay : '';
        },
        clsMode: function (ref) {
          var mode = ref.mode;
          var clsMode = ref.clsMode;
          return clsMode + "-" + mode;
        },
        clsSidebarAnimation: function (ref) {
          var mode = ref.mode;
          var clsSidebarAnimation = ref.clsSidebarAnimation;
          return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
        },
        clsContainerAnimation: function (ref) {
          var mode = ref.mode;
          var clsContainerAnimation = ref.clsContainerAnimation;
          return mode !== 'push' && mode !== 'reveal' ? '' : clsContainerAnimation;
        },
        transitionElement: function (ref) {
          var mode = ref.mode;
          return mode === 'reveal' ? parent(this.panel) : this.panel;
        }
      },
      update: {
        read: function () {
          if (this.isToggled() && !isVisible(this.$el)) {
            this.hide();
          }
        },
        events: ['resize']
      },
      events: [{
        name: 'click',
        delegate: function () {
          return 'a[href^="#"]';
        },
        handler: function (ref) {
          var hash = ref.current.hash;
          var defaultPrevented = ref.defaultPrevented;

          if (!defaultPrevented && hash && $(hash, document.body)) {
            this.hide();
          }
        }
      }, {
        name: 'touchstart',
        passive: true,
        el: function () {
          return this.panel;
        },
        handler: function (ref) {
          var targetTouches = ref.targetTouches;

          if (targetTouches.length === 1) {
            this.clientY = targetTouches[0].clientY;
          }
        }
      }, {
        name: 'touchmove',
        self: true,
        passive: false,
        filter: function () {
          return this.overlay;
        },
        handler: function (e) {
          e.cancelable && e.preventDefault();
        }
      }, {
        name: 'touchmove',
        passive: false,
        el: function () {
          return this.panel;
        },
        handler: function (e) {
          if (e.targetTouches.length !== 1) {
            return;
          }

          var clientY = e.targetTouches[0].clientY - this.clientY;
          var ref = this.panel;
          var scrollTop = ref.scrollTop;
          var scrollHeight = ref.scrollHeight;
          var clientHeight = ref.clientHeight;

          if (clientHeight >= scrollHeight || scrollTop === 0 && clientY > 0 || scrollHeight - scrollTop <= clientHeight && clientY < 0) {
            e.cancelable && e.preventDefault();
          }
        }
      }, {
        name: 'show',
        self: true,
        handler: function () {
          if (this.mode === 'reveal' && !hasClass(parent(this.panel), this.clsMode)) {
            wrapAll(this.panel, '<div>');
            addClass(parent(this.panel), this.clsMode);
          }

          css(document.documentElement, 'overflowY', this.overlay ? 'hidden' : '');
          addClass(document.body, this.clsContainer, this.clsFlip);
          css(document.body, 'touch-action', 'pan-y pinch-zoom');
          css(this.$el, 'display', 'block');
          addClass(this.$el, this.clsOverlay);
          addClass(this.panel, this.clsSidebarAnimation, this.mode !== 'reveal' ? this.clsMode : '');
          height(document.body); // force reflow

          addClass(document.body, this.clsContainerAnimation);
          this.clsContainerAnimation && suppressUserScale();
        }
      }, {
        name: 'hide',
        self: true,
        handler: function () {
          removeClass(document.body, this.clsContainerAnimation);
          css(document.body, 'touch-action', '');
        }
      }, {
        name: 'hidden',
        self: true,
        handler: function () {
          this.clsContainerAnimation && resumeUserScale();

          if (this.mode === 'reveal') {
            unwrap(this.panel);
          }

          removeClass(this.panel, this.clsSidebarAnimation, this.clsMode);
          removeClass(this.$el, this.clsOverlay);
          css(this.$el, 'display', '');
          removeClass(document.body, this.clsContainer, this.clsFlip);
          css(document.documentElement, 'overflowY', '');
        }
      }, {
        name: 'swipeLeft swipeRight',
        handler: function (e) {
          if (this.isToggled() && endsWith(e.type, 'Left') ^ this.flip) {
            this.hide();
          }
        }
      }]
    }; // Chrome in responsive mode zooms page upon opening offcanvas

    function suppressUserScale() {
      getViewport().content += ',user-scalable=0';
    }

    function resumeUserScale() {
      var viewport = getViewport();
      viewport.content = viewport.content.replace(/,user-scalable=0$/, '');
    }

    function getViewport() {
      return $('meta[name="viewport"]', document.head) || append(document.head, '<meta name="viewport">');
    }

    var overflowAuto = {
      mixins: [Class],
      props: {
        selContainer: String,
        selContent: String,
        minHeight: Number
      },
      data: {
        selContainer: '.uk-modal',
        selContent: '.uk-modal-dialog',
        minHeight: 150
      },
      computed: {
        container: function (ref, $el) {
          var selContainer = ref.selContainer;
          return closest($el, selContainer);
        },
        content: function (ref, $el) {
          var selContent = ref.selContent;
          return closest($el, selContent);
        }
      },
      connected: function () {
        css(this.$el, 'minHeight', this.minHeight);
      },
      update: {
        read: function () {
          if (!this.content || !this.container || !isVisible(this.$el)) {
            return false;
          }

          return {
            current: toFloat(css(this.$el, 'maxHeight')),
            max: Math.max(this.minHeight, height(this.container) - (dimensions(this.content).height - height(this.$el)))
          };
        },
        write: function (ref) {
          var current = ref.current;
          var max = ref.max;
          css(this.$el, 'maxHeight', max);

          if (Math.round(current) !== Math.round(max)) {
            trigger(this.$el, 'resize');
          }
        },
        events: ['resize']
      }
    };
    var responsive = {
      props: ['width', 'height'],
      connected: function () {
        addClass(this.$el, 'uk-responsive-width');
      },
      update: {
        read: function () {
          return isVisible(this.$el) && this.width && this.height ? {
            width: width(parent(this.$el)),
            height: this.height
          } : false;
        },
        write: function (dim) {
          height(this.$el, Dimensions.contain({
            height: this.height,
            width: this.width
          }, dim).height);
        },
        events: ['resize']
      }
    };
    var scroll = {
      props: {
        offset: Number
      },
      data: {
        offset: 0
      },
      methods: {
        scrollTo: function (el) {
          var this$1$1 = this;
          el = el && $(el) || document.body;

          if (trigger(this.$el, 'beforescroll', [this, el])) {
            scrollIntoView(el, {
              offset: this.offset
            }).then(function () {
              return trigger(this$1$1.$el, 'scrolled', [this$1$1, el]);
            });
          }
        }
      },
      events: {
        click: function (e) {
          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();
          this.scrollTo("#" + escape(decodeURIComponent((this.$el.hash || '').substr(1))));
        }
      }
    };
    var stateKey = '_ukScrollspy';
    var scrollspy = {
      args: 'cls',
      props: {
        cls: String,
        target: String,
        hidden: Boolean,
        offsetTop: Number,
        offsetLeft: Number,
        repeat: Boolean,
        delay: Number
      },
      data: function () {
        return {
          cls: false,
          target: false,
          hidden: true,
          offsetTop: 0,
          offsetLeft: 0,
          repeat: false,
          delay: 0,
          inViewClass: 'uk-scrollspy-inview'
        };
      },
      computed: {
        elements: {
          get: function (ref, $el) {
            var target = ref.target;
            return target ? $$(target, $el) : [$el];
          },
          watch: function (elements) {
            if (this.hidden) {
              css(filter$1(elements, ":not(." + this.inViewClass + ")"), 'visibility', 'hidden');
            }
          },
          immediate: true
        }
      },
      disconnected: function () {
        var this$1$1 = this;
        this.elements.forEach(function (el) {
          removeClass(el, this$1$1.inViewClass, el[stateKey] ? el[stateKey].cls : '');
          delete el[stateKey];
        });
      },
      update: [{
        read: function (data$1) {
          var this$1$1 = this; // Let child components be applied at least once first

          if (!data$1.update) {
            Promise$1.resolve().then(function () {
              this$1$1.$emit();
              data$1.update = true;
            });
            return false;
          }

          this.elements.forEach(function (el) {
            if (!el[stateKey]) {
              el[stateKey] = {
                cls: data(el, 'uk-scrollspy-class') || this$1$1.cls
              };
            }

            el[stateKey].show = isInView(el, this$1$1.offsetTop, this$1$1.offsetLeft);
          });
        },
        write: function (data) {
          var this$1$1 = this;
          this.elements.forEach(function (el) {
            var state = el[stateKey];

            if (state.show && !state.inview && !state.queued) {
              state.queued = true;
              data.promise = (data.promise || Promise$1.resolve()).then(function () {
                return new Promise$1(function (resolve) {
                  return setTimeout(resolve, this$1$1.delay);
                });
              }).then(function () {
                this$1$1.toggle(el, true);
                setTimeout(function () {
                  state.queued = false;
                  this$1$1.$emit();
                }, 300);
              });
            } else if (!state.show && state.inview && !state.queued && this$1$1.repeat) {
              this$1$1.toggle(el, false);
            }
          });
        },
        events: ['scroll', 'resize']
      }],
      methods: {
        toggle: function (el, inview) {
          var state = el[stateKey];
          state.off && state.off();
          css(el, 'visibility', !inview && this.hidden ? 'hidden' : '');
          toggleClass(el, this.inViewClass, inview);
          toggleClass(el, state.cls);

          if (/\buk-animation-/.test(state.cls)) {
            state.off = once(el, 'animationcancel animationend', function () {
              return removeClasses(el, 'uk-animation-[\\w-]+');
            });
          }

          trigger(el, inview ? 'inview' : 'outview');
          state.inview = inview;
          this.$update(el);
        }
      }
    };
    var scrollspyNav = {
      props: {
        cls: String,
        closest: String,
        scroll: Boolean,
        overflow: Boolean,
        offset: Number
      },
      data: {
        cls: 'uk-active',
        closest: false,
        scroll: false,
        overflow: true,
        offset: 0
      },
      computed: {
        links: {
          get: function (_, $el) {
            return $$('a[href^="#"]', $el).filter(function (el) {
              return el.hash;
            });
          },
          watch: function (links) {
            if (this.scroll) {
              this.$create('scroll', links, {
                offset: this.offset || 0
              });
            }
          },
          immediate: true
        },
        targets: function () {
          return $$(this.links.map(function (el) {
            return escape(el.hash).substr(1);
          }).join(','));
        },
        elements: function (ref) {
          var selector = ref.closest;
          return closest(this.links, selector || '*');
        }
      },
      update: [{
        read: function () {
          var this$1$1 = this;
          var ref = this.targets;
          var length = ref.length;

          if (!length || !isVisible(this.$el)) {
            return false;
          }

          var ref$1 = scrollParents(this.targets, /auto|scroll/, true);
          var scrollElement = ref$1[0];
          var scrollTop = scrollElement.scrollTop;
          var scrollHeight = scrollElement.scrollHeight;
          var max = scrollHeight - getViewportClientHeight(scrollElement);
          var active = false;

          if (scrollTop === max) {
            active = length - 1;
          } else {
            this.targets.every(function (el, i) {
              if (offset(el).top - offset(getViewport$1(scrollElement)).top - this$1$1.offset <= 0) {
                active = i;
                return true;
              }
            });

            if (active === false && this.overflow) {
              active = 0;
            }
          }

          return {
            active: active
          };
        },
        write: function (ref) {
          var active = ref.active;
          var changed = active !== false && !hasClass(this.elements[active], this.cls);
          this.links.forEach(function (el) {
            return el.blur();
          });
          removeClass(this.elements, this.cls);
          addClass(this.elements[active], this.cls);

          if (changed) {
            trigger(this.$el, 'active', [active, this.elements[active]]);
          }
        },
        events: ['scroll', 'resize']
      }]
    };
    var sticky = {
      mixins: [Class, Media],
      props: {
        top: null,
        bottom: Boolean,
        offset: String,
        animation: String,
        clsActive: String,
        clsInactive: String,
        clsFixed: String,
        clsBelow: String,
        selTarget: String,
        widthElement: Boolean,
        showOnUp: Boolean,
        targetOffset: Number
      },
      data: {
        top: 0,
        bottom: false,
        offset: 0,
        animation: '',
        clsActive: 'uk-active',
        clsInactive: '',
        clsFixed: 'uk-sticky-fixed',
        clsBelow: 'uk-sticky-below',
        selTarget: '',
        widthElement: false,
        showOnUp: false,
        targetOffset: false
      },
      computed: {
        offset: function (ref) {
          var offset = ref.offset;
          return toPx(offset);
        },
        selTarget: function (ref, $el) {
          var selTarget = ref.selTarget;
          return selTarget && $(selTarget, $el) || $el;
        },
        widthElement: function (ref, $el) {
          var widthElement = ref.widthElement;
          return query(widthElement, $el) || this.placeholder;
        },
        isActive: {
          get: function () {
            return hasClass(this.selTarget, this.clsActive);
          },
          set: function (value) {
            if (value && !this.isActive) {
              replaceClass(this.selTarget, this.clsInactive, this.clsActive);
              trigger(this.$el, 'active');
            } else if (!value && !hasClass(this.selTarget, this.clsInactive)) {
              replaceClass(this.selTarget, this.clsActive, this.clsInactive);
              trigger(this.$el, 'inactive');
            }
          }
        }
      },
      connected: function () {
        this.placeholder = $('+ .uk-sticky-placeholder', this.$el) || $('<div class="uk-sticky-placeholder"></div>');
        this.isFixed = false;
        this.isActive = false;
      },
      disconnected: function () {
        if (this.isFixed) {
          this.hide();
          removeClass(this.selTarget, this.clsInactive);
        }

        remove$1(this.placeholder);
        this.placeholder = null;
        this.widthElement = null;
      },
      events: [{
        name: 'load hashchange popstate',
        el: function () {
          return window;
        },
        handler: function () {
          var this$1$1 = this;

          if (!(this.targetOffset !== false && location.hash && window.pageYOffset > 0)) {
            return;
          }

          var target = $(location.hash);

          if (target) {
            fastdom.read(function () {
              var ref = offset(target);
              var top = ref.top;
              var elTop = offset(this$1$1.$el).top;
              var elHeight = this$1$1.$el.offsetHeight;

              if (this$1$1.isFixed && elTop + elHeight >= top && elTop <= top + target.offsetHeight) {
                scrollTop(window, top - elHeight - (isNumeric(this$1$1.targetOffset) ? this$1$1.targetOffset : 0) - this$1$1.offset);
              }
            });
          }
        }
      }],
      update: [{
        read: function (ref, types) {
          var height = ref.height;
          this.inactive = !this.matchMedia || !isVisible(this.$el);

          if (this.inactive) {
            return false;
          }

          if (this.isActive && types.has('resize')) {
            this.hide();
            height = this.$el.offsetHeight;
            this.show();
          }

          height = !this.isActive ? this.$el.offsetHeight : height;
          this.topOffset = offset(this.isFixed ? this.placeholder : this.$el).top;
          this.bottomOffset = this.topOffset + height;
          this.offsetParentTop = offset(this.$el.offsetParent).top;
          var bottom = parseProp('bottom', this);
          this.top = Math.max(toFloat(parseProp('top', this)), this.topOffset) - this.offset;
          this.bottom = bottom && bottom - this.$el.offsetHeight;
          this.width = dimensions(isVisible(this.widthElement) ? this.widthElement : this.$el).width;
          return {
            height: height,
            top: offsetPosition(this.placeholder)[0],
            margins: css(this.$el, ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
          };
        },
        write: function (ref) {
          var height = ref.height;
          var margins = ref.margins;
          var ref$1 = this;
          var placeholder = ref$1.placeholder;
          css(placeholder, assign({
            height: height
          }, margins));

          if (!within(placeholder, document)) {
            after(this.$el, placeholder);
            placeholder.hidden = true;
          }

          this.isActive = !!this.isActive; // force self-assign
        },
        events: ['resize']
      }, {
        read: function (ref) {
          var scroll = ref.scroll;
          if (scroll === void 0) scroll = 0;
          this.scroll = window.pageYOffset;
          return {
            dir: scroll <= this.scroll ? 'down' : 'up',
            scroll: this.scroll
          };
        },
        write: function (data, types) {
          var this$1$1 = this;
          var now = Date.now();
          var isScrollUpdate = types.has('scroll');
          var initTimestamp = data.initTimestamp;
          if (initTimestamp === void 0) initTimestamp = 0;
          var dir = data.dir;
          var lastDir = data.lastDir;
          var lastScroll = data.lastScroll;
          var scroll = data.scroll;
          var top = data.top;
          data.lastScroll = scroll;

          if (scroll < 0 || scroll === lastScroll && isScrollUpdate || this.showOnUp && !isScrollUpdate && !this.isFixed) {
            return;
          }

          if (now - initTimestamp > 300 || dir !== lastDir) {
            data.initScroll = scroll;
            data.initTimestamp = now;
          }

          data.lastDir = dir;

          if (this.showOnUp && !this.isFixed && Math.abs(data.initScroll - scroll) <= 30 && Math.abs(lastScroll - scroll) <= 10) {
            return;
          }

          if (this.inactive || scroll < this.top || this.showOnUp && (scroll <= this.top || dir === 'down' && isScrollUpdate || dir === 'up' && !this.isFixed && scroll <= this.bottomOffset)) {
            if (!this.isFixed) {
              if (Animation.inProgress(this.$el) && top > scroll) {
                Animation.cancel(this.$el);
                this.hide();
              }

              return;
            }

            this.isFixed = false;

            if (this.animation && scroll > this.topOffset) {
              Animation.cancel(this.$el);
              Animation.out(this.$el, this.animation).then(function () {
                return this$1$1.hide();
              }, noop);
            } else {
              this.hide();
            }
          } else if (this.isFixed) {
            this.update();
          } else if (this.animation) {
            Animation.cancel(this.$el);
            this.show();
            Animation.in(this.$el, this.animation).catch(noop);
          } else {
            this.show();
          }
        },
        events: ['resize', 'scroll']
      }],
      methods: {
        show: function () {
          this.isFixed = true;
          this.update();
          this.placeholder.hidden = false;
        },
        hide: function () {
          this.isActive = false;
          removeClass(this.$el, this.clsFixed, this.clsBelow);
          css(this.$el, {
            position: '',
            top: '',
            width: ''
          });
          this.placeholder.hidden = true;
        },
        update: function () {
          var active = this.top !== 0 || this.scroll > this.top;
          var top = Math.max(0, this.offset);
          var position = 'fixed';

          if (isNumeric(this.bottom) && this.scroll > this.bottom - this.offset) {
            top = this.bottom - this.offsetParentTop;
            position = 'absolute';
          }

          css(this.$el, {
            position: position,
            top: top + "px",
            width: this.width
          });
          this.isActive = active;
          toggleClass(this.$el, this.clsBelow, this.scroll > this.bottomOffset);
          addClass(this.$el, this.clsFixed);
        }
      }
    };

    function parseProp(prop, ref) {
      var $props = ref.$props;
      var $el = ref.$el;
      var propOffset = ref[prop + "Offset"];
      var value = $props[prop];

      if (!value) {
        return;
      }

      if (isString(value) && value.match(/^-?\d/)) {
        return propOffset + toPx(value);
      } else {
        return offset(value === true ? parent($el) : query(value, $el)).bottom;
      }
    }

    var Switcher = {
      mixins: [Togglable],
      args: 'connect',
      props: {
        connect: String,
        toggle: String,
        itemNav: String,
        active: Number,
        swiping: Boolean
      },
      data: {
        connect: '~.uk-switcher',
        toggle: '> * > :first-child',
        itemNav: false,
        active: 0,
        swiping: true,
        cls: 'uk-active',
        attrItem: 'uk-switcher-item'
      },
      computed: {
        connects: {
          get: function (ref, $el) {
            var connect = ref.connect;
            return queryAll(connect, $el);
          },
          watch: function (connects) {
            var this$1$1 = this;

            if (this.swiping) {
              css(connects, 'touch-action', 'pan-y pinch-zoom');
            }

            var index = this.index();
            this.connects.forEach(function (el) {
              return children(el).forEach(function (child, i) {
                return toggleClass(child, this$1$1.cls, i === index);
              });
            });
          },
          immediate: true
        },
        toggles: {
          get: function (ref, $el) {
            var toggle = ref.toggle;
            return $$(toggle, $el).filter(function (el) {
              return !matches(el, '.uk-disabled *, .uk-disabled, [disabled]');
            });
          },
          watch: function (toggles) {
            var active = this.index();
            this.show(~active ? active : toggles[this.active] || toggles[0]);
          },
          immediate: true
        },
        children: function () {
          var this$1$1 = this;
          return children(this.$el).filter(function (child) {
            return this$1$1.toggles.some(function (toggle) {
              return within(toggle, child);
            });
          });
        }
      },
      events: [{
        name: 'click',
        delegate: function () {
          return this.toggle;
        },
        handler: function (e) {
          e.preventDefault();
          this.show(e.current);
        }
      }, {
        name: 'click',
        el: function () {
          return this.connects.concat(this.itemNav ? queryAll(this.itemNav, this.$el) : []);
        },
        delegate: function () {
          return "[" + this.attrItem + "],[data-" + this.attrItem + "]";
        },
        handler: function (e) {
          e.preventDefault();
          this.show(data(e.current, this.attrItem));
        }
      }, {
        name: 'swipeRight swipeLeft',
        filter: function () {
          return this.swiping;
        },
        el: function () {
          return this.connects;
        },
        handler: function (ref) {
          var type = ref.type;
          this.show(endsWith(type, 'Left') ? 'next' : 'previous');
        }
      }],
      methods: {
        index: function () {
          var this$1$1 = this;
          return findIndex(this.children, function (el) {
            return hasClass(el, this$1$1.cls);
          });
        },
        show: function (item) {
          var this$1$1 = this;
          var prev = this.index();
          var next = getIndex(this.children[getIndex(item, this.toggles, prev)], children(this.$el));

          if (prev === next) {
            return;
          }

          this.children.forEach(function (child, i) {
            toggleClass(child, this$1$1.cls, next === i);
            attr(this$1$1.toggles[i], 'aria-expanded', next === i);
          });
          this.connects.forEach(function (ref) {
            var children = ref.children;
            return this$1$1.toggleElement(toNodes(children).filter(function (child) {
              return hasClass(child, this$1$1.cls);
            }), false, prev >= 0).then(function () {
              return this$1$1.toggleElement(children[next], true, prev >= 0);
            });
          });
        }
      }
    };
    var tab = {
      mixins: [Class],
      extends: Switcher,
      props: {
        media: Boolean
      },
      data: {
        media: 960,
        attrItem: 'uk-tab-item'
      },
      connected: function () {
        var cls = hasClass(this.$el, 'uk-tab-left') ? 'uk-tab-left' : hasClass(this.$el, 'uk-tab-right') ? 'uk-tab-right' : false;

        if (cls) {
          this.$create('toggle', this.$el, {
            cls: cls,
            mode: 'media',
            media: this.media
          });
        }
      }
    };
    var toggle = {
      mixins: [Media, Togglable],
      args: 'target',
      props: {
        href: String,
        target: null,
        mode: 'list',
        queued: Boolean
      },
      data: {
        href: false,
        target: false,
        mode: 'click',
        queued: true
      },
      connected: function () {
        if (!includes(this.mode, 'media') && !isFocusable(this.$el)) {
          attr(this.$el, 'tabindex', '0');
        }
      },
      computed: {
        target: {
          get: function (ref, $el) {
            var href = ref.href;
            var target = ref.target;
            target = queryAll(target || href, $el);
            return target.length && target || [$el];
          },
          watch: function () {
            this.updateAria();
          },
          immediate: true
        }
      },
      events: [{
        name: pointerDown,
        filter: function () {
          return includes(this.mode, 'hover');
        },
        handler: function (e) {
          var this$1$1 = this;

          if (!isTouch(e) || this._showState) {
            return;
          } // Clicking a button does not give it focus on all browsers and platforms
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus


          trigger(this.$el, 'focus');
          once(document, pointerDown, function () {
            return trigger(this$1$1.$el, 'blur');
          }, true, function (e) {
            return !within(e.target, this$1$1.$el);
          }); // Prevent initial click to prevent double toggle through focus + click

          if (includes(this.mode, 'click')) {
            this._preventClick = true;
          }
        }
      }, {
        name: pointerEnter + " " + pointerLeave + " focus blur",
        filter: function () {
          return includes(this.mode, 'hover');
        },
        handler: function (e) {
          if (isTouch(e)) {
            return;
          }

          var show = includes([pointerEnter, 'focus'], e.type);
          var expanded = attr(this.$el, 'aria-expanded'); // Skip hide if still hovered or focused

          if (!show && (e.type === pointerLeave && matches(this.$el, ':focus') || e.type === 'blur' && matches(this.$el, ':hover'))) {
            return;
          } // Skip if state does not change e.g. hover + focus received


          if (this._showState && show === (expanded !== this._showState)) {
            // Ensure reset if state has changed through click
            if (!show) {
              this._showState = null;
            }

            return;
          }

          this._showState = show ? expanded : null;
          this.toggle("toggle" + (show ? 'show' : 'hide'));
        }
      }, {
        name: 'keydown',
        filter: function () {
          return includes(this.mode, 'click');
        },
        handler: function (e) {
          // Space
          if (e.keyCode === 32) {
            e.preventDefault();
            this.$el.click();
          }
        }
      }, {
        name: 'click',
        filter: function () {
          return includes(this.mode, 'click');
        },
        handler: function (e) {
          if (this._preventClick) {
            return this._preventClick = null;
          }

          var link;

          if (closest(e.target, 'a[href="#"], a[href=""]') || (link = closest(e.target, 'a[href]')) && (attr(this.$el, 'aria-expanded') !== 'true' || link.hash && matches(this.target, link.hash))) {
            e.preventDefault();
          }

          this.toggle();
        }
      }, {
        name: 'toggled',
        self: true,
        el: function () {
          return this.target;
        },
        handler: function (e, toggled) {
          if (e.target === this.target[0]) {
            this.updateAria(toggled);
          }
        }
      }],
      update: {
        read: function () {
          return includes(this.mode, 'media') && this.media ? {
            match: this.matchMedia
          } : false;
        },
        write: function (ref) {
          var match = ref.match;
          var toggled = this.isToggled(this.target);

          if (match ? !toggled : toggled) {
            this.toggle();
          }
        },
        events: ['resize']
      },
      methods: {
        toggle: function (type) {
          var this$1$1 = this;

          if (!trigger(this.target, type || 'toggle', [this])) {
            return;
          }

          if (!this.queued) {
            return this.toggleElement(this.target);
          }

          var leaving = this.target.filter(function (el) {
            return hasClass(el, this$1$1.clsLeave);
          });

          if (leaving.length) {
            this.target.forEach(function (el) {
              var isLeaving = includes(leaving, el);
              this$1$1.toggleElement(el, isLeaving, isLeaving);
            });
            return;
          }

          var toggled = this.target.filter(this.isToggled);
          this.toggleElement(toggled, false).then(function () {
            return this$1$1.toggleElement(this$1$1.target.filter(function (el) {
              return !includes(toggled, el);
            }), true);
          });
        },
        updateAria: function (toggled) {
          if (includes(this.mode, 'media')) {
            return;
          }

          attr(this.$el, 'aria-expanded', isBoolean(toggled) ? toggled : this.isToggled(this.target));
        }
      }
    };
    var components$1 = /*#__PURE__*/Object.freeze({
      __proto__: null,
      Accordion: Accordion,
      Alert: alert,
      Cover: cover,
      Drop: drop,
      Dropdown: drop,
      FormCustom: formCustom,
      Gif: gif,
      Grid: grid,
      HeightMatch: heightMatch,
      HeightViewport: heightViewport,
      Icon: Icon,
      Img: img,
      Leader: leader,
      Margin: Margin,
      Modal: modal,
      Nav: nav,
      Navbar: navbar,
      Offcanvas: offcanvas,
      OverflowAuto: overflowAuto,
      Responsive: responsive,
      Scroll: scroll,
      Scrollspy: scrollspy,
      ScrollspyNav: scrollspyNav,
      Sticky: sticky,
      Svg: SVG,
      Switcher: Switcher,
      Tab: tab,
      Toggle: toggle,
      Video: Video,
      Close: Close,
      Spinner: Spinner,
      SlidenavNext: Slidenav,
      SlidenavPrevious: Slidenav,
      SearchIcon: Search,
      Marker: IconComponent,
      NavbarToggleIcon: IconComponent,
      OverlayIcon: IconComponent,
      PaginationNext: IconComponent,
      PaginationPrevious: IconComponent,
      Totop: IconComponent
    }); // register components

    each(components$1, function (component, name) {
      return UIkit.component(name, component);
    }); // core functionality

    UIkit.use(Core);
    boot(UIkit);
    var countdown = {
      mixins: [Class],
      props: {
        date: String,
        clsWrapper: String
      },
      data: {
        date: '',
        clsWrapper: '.uk-countdown-%unit%'
      },
      computed: {
        date: function (ref) {
          var date = ref.date;
          return Date.parse(date);
        },
        days: function (ref, $el) {
          var clsWrapper = ref.clsWrapper;
          return $(clsWrapper.replace('%unit%', 'days'), $el);
        },
        hours: function (ref, $el) {
          var clsWrapper = ref.clsWrapper;
          return $(clsWrapper.replace('%unit%', 'hours'), $el);
        },
        minutes: function (ref, $el) {
          var clsWrapper = ref.clsWrapper;
          return $(clsWrapper.replace('%unit%', 'minutes'), $el);
        },
        seconds: function (ref, $el) {
          var clsWrapper = ref.clsWrapper;
          return $(clsWrapper.replace('%unit%', 'seconds'), $el);
        },
        units: function () {
          var this$1$1 = this;
          return ['days', 'hours', 'minutes', 'seconds'].filter(function (unit) {
            return this$1$1[unit];
          });
        }
      },
      connected: function () {
        this.start();
      },
      disconnected: function () {
        var this$1$1 = this;
        this.stop();
        this.units.forEach(function (unit) {
          return empty(this$1$1[unit]);
        });
      },
      events: [{
        name: 'visibilitychange',
        el: function () {
          return document;
        },
        handler: function () {
          if (document.hidden) {
            this.stop();
          } else {
            this.start();
          }
        }
      }],
      update: {
        write: function () {
          var this$1$1 = this;
          var timespan = getTimeSpan(this.date);

          if (timespan.total <= 0) {
            this.stop();
            timespan.days = timespan.hours = timespan.minutes = timespan.seconds = 0;
          }

          this.units.forEach(function (unit) {
            var digits = String(Math.floor(timespan[unit]));
            digits = digits.length < 2 ? "0" + digits : digits;
            var el = this$1$1[unit];

            if (el.textContent !== digits) {
              digits = digits.split('');

              if (digits.length !== el.children.length) {
                html(el, digits.map(function () {
                  return '<span></span>';
                }).join(''));
              }

              digits.forEach(function (digit, i) {
                return el.children[i].textContent = digit;
              });
            }
          });
        }
      },
      methods: {
        start: function () {
          this.stop();

          if (this.date && this.units.length) {
            this.$update();
            this.timer = setInterval(this.$update, 1000);
          }
        },
        stop: function () {
          if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }
      }
    };

    function getTimeSpan(date) {
      var total = date - Date.now();
      return {
        total: total,
        seconds: total / 1000 % 60,
        minutes: total / 1000 / 60 % 60,
        hours: total / 1000 / 60 / 60 % 24,
        days: total / 1000 / 60 / 60 / 24
      };
    }

    var clsLeave = 'uk-transition-leave';
    var clsEnter = 'uk-transition-enter';

    function fade(action, target, duration, stagger) {
      if (stagger === void 0) stagger = 0;
      var index = transitionIndex(target, true);
      var propsIn = {
        opacity: 1
      };
      var propsOut = {
        opacity: 0
      };

      var wrapIndexFn = function (fn) {
        return function () {
          return index === transitionIndex(target) ? fn() : Promise$1.reject();
        };
      };

      var leaveFn = wrapIndexFn(function () {
        addClass(target, clsLeave);
        return Promise$1.all(getTransitionNodes(target).map(function (child, i) {
          return new Promise$1(function (resolve) {
            return setTimeout(function () {
              return Transition.start(child, propsOut, duration / 2, 'ease').then(resolve);
            }, i * stagger);
          });
        })).then(function () {
          return removeClass(target, clsLeave);
        });
      });
      var enterFn = wrapIndexFn(function () {
        var oldHeight = height(target);
        addClass(target, clsEnter);
        action();
        css(children(target), {
          opacity: 0
        }); // Ensure UIkit updates have propagated

        return new Promise$1(function (resolve) {
          return requestAnimationFrame(function () {
            var nodes = children(target);
            var newHeight = height(target); // Ensure Grid cells do not stretch when height is applied

            css(target, 'alignContent', 'flex-start');
            height(target, oldHeight);
            var transitionNodes = getTransitionNodes(target);
            css(nodes, propsOut);
            var transitions = transitionNodes.map(function (child, i) {
              return new Promise$1(function (resolve) {
                return setTimeout(function () {
                  return Transition.start(child, propsIn, duration / 2, 'ease').then(resolve);
                }, i * stagger);
              });
            });

            if (oldHeight !== newHeight) {
              transitions.push(Transition.start(target, {
                height: newHeight
              }, duration / 2 + transitionNodes.length * stagger, 'ease'));
            }

            Promise$1.all(transitions).then(function () {
              removeClass(target, clsEnter);

              if (index === transitionIndex(target)) {
                css(target, {
                  height: '',
                  alignContent: ''
                });
                css(nodes, {
                  opacity: ''
                });
                delete target.dataset.transition;
              }

              resolve();
            });
          });
        });
      });
      return hasClass(target, clsLeave) ? waitTransitionend(target).then(enterFn) : hasClass(target, clsEnter) ? waitTransitionend(target).then(leaveFn).then(enterFn) : leaveFn().then(enterFn);
    }

    function transitionIndex(target, next) {
      if (next) {
        target.dataset.transition = 1 + transitionIndex(target);
      }

      return toNumber(target.dataset.transition) || 0;
    }

    function waitTransitionend(target) {
      return Promise$1.all(children(target).filter(Transition.inProgress).map(function (el) {
        return new Promise$1(function (resolve) {
          return once(el, 'transitionend transitioncanceled', resolve);
        });
      }));
    }

    function getTransitionNodes(target) {
      return getRows(children(target)).reduce(function (nodes, row) {
        return nodes.concat(sortBy$1(row.filter(function (el) {
          return isInView(el);
        }), 'offsetLeft'));
      }, []);
    }

    function slide(action, target, duration) {
      return new Promise$1(function (resolve) {
        return requestAnimationFrame(function () {
          var nodes = children(target); // Get current state

          var currentProps = nodes.map(function (el) {
            return getProps(el, true);
          });
          var targetProps = css(target, ['height', 'padding']); // Cancel previous animations

          Transition.cancel(target);
          nodes.forEach(Transition.cancel);
          reset(target); // Adding, sorting, removing nodes

          action(); // Find new nodes

          nodes = nodes.concat(children(target).filter(function (el) {
            return !includes(nodes, el);
          })); // Wait for update to propagate

          Promise$1.resolve().then(function () {
            // Force update
            fastdom.flush(); // Get new state

            var targetPropsTo = css(target, ['height', 'padding']);
            var ref = getTransitionProps(target, nodes, currentProps);
            var propsTo = ref[0];
            var propsFrom = ref[1]; // Reset to previous state

            nodes.forEach(function (el, i) {
              return propsFrom[i] && css(el, propsFrom[i]);
            });
            css(target, assign({
              display: 'block'
            }, targetProps)); // Start transitions on next frame

            requestAnimationFrame(function () {
              var transitions = nodes.map(function (el, i) {
                return parent(el) === target && Transition.start(el, propsTo[i], duration, 'ease');
              }).concat(Transition.start(target, targetPropsTo, duration, 'ease'));
              Promise$1.all(transitions).then(function () {
                nodes.forEach(function (el, i) {
                  return parent(el) === target && css(el, 'display', propsTo[i].opacity === 0 ? 'none' : '');
                });
                reset(target);
              }, noop).then(resolve);
            });
          });
        });
      });
    }

    function getProps(el, opacity) {
      var zIndex = css(el, 'zIndex');
      return isVisible(el) ? assign({
        display: '',
        opacity: opacity ? css(el, 'opacity') : '0',
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: zIndex === 'auto' ? index(el) : zIndex
      }, getPositionWithMargin(el)) : false;
    }

    function getTransitionProps(target, nodes, currentProps) {
      var propsTo = nodes.map(function (el, i) {
        return parent(el) && i in currentProps ? currentProps[i] ? isVisible(el) ? getPositionWithMargin(el) : {
          opacity: 0
        } : {
          opacity: isVisible(el) ? 1 : 0
        } : false;
      });
      var propsFrom = propsTo.map(function (props, i) {
        var from = parent(nodes[i]) === target && (currentProps[i] || getProps(nodes[i]));

        if (!from) {
          return false;
        }

        if (!props) {
          delete from.opacity;
        } else if (!('opacity' in props)) {
          var opacity = from.opacity;

          if (opacity % 1) {
            props.opacity = 1;
          } else {
            delete from.opacity;
          }
        }

        return from;
      });
      return [propsTo, propsFrom];
    }

    function reset(el) {
      css(el.children, {
        height: '',
        left: '',
        opacity: '',
        pointerEvents: '',
        position: '',
        top: '',
        marginTop: '',
        marginLeft: '',
        transform: '',
        width: '',
        zIndex: ''
      });
      css(el, {
        height: '',
        display: '',
        padding: ''
      });
    }

    function getPositionWithMargin(el) {
      var ref = offset(el);
      var height = ref.height;
      var width = ref.width;
      var ref$1 = position(el);
      var top = ref$1.top;
      var left = ref$1.left;
      var ref$2 = css(el, ['marginTop', 'marginLeft']);
      var marginLeft = ref$2.marginLeft;
      var marginTop = ref$2.marginTop;
      return {
        top: top,
        left: left,
        height: height,
        width: width,
        marginLeft: marginLeft,
        marginTop: marginTop,
        transform: ''
      };
    }

    var Animate = {
      props: {
        duration: Number,
        animation: Boolean
      },
      data: {
        duration: 150,
        animation: 'slide'
      },
      methods: {
        animate: function (action, target) {
          var this$1$1 = this;
          if (target === void 0) target = this.$el;
          var name = this.animation;
          var animationFn = name === 'fade' ? fade : name === 'delayed-fade' ? function () {
            var args = [],
                len = arguments.length;

            while (len--) args[len] = arguments[len];

            return fade.apply(void 0, args.concat([40]));
          } : !name ? function () {
            action();
            return Promise$1.resolve();
          } : slide;
          return animationFn(action, target, this.duration).then(function () {
            return this$1$1.$update(target, 'resize');
          }, noop);
        }
      }
    };
    var filter = {
      mixins: [Animate],
      args: 'target',
      props: {
        target: Boolean,
        selActive: Boolean
      },
      data: {
        target: null,
        selActive: false,
        attrItem: 'uk-filter-control',
        cls: 'uk-active',
        duration: 250
      },
      computed: {
        toggles: {
          get: function (ref, $el) {
            var attrItem = ref.attrItem;
            return $$("[" + attrItem + "],[data-" + attrItem + "]", $el);
          },
          watch: function () {
            var this$1$1 = this;
            this.updateState();

            if (this.selActive !== false) {
              var actives = $$(this.selActive, this.$el);
              this.toggles.forEach(function (el) {
                return toggleClass(el, this$1$1.cls, includes(actives, el));
              });
            }
          },
          immediate: true
        },
        children: {
          get: function (ref, $el) {
            var target = ref.target;
            return $$(target + " > *", $el);
          },
          watch: function (list, old) {
            if (old && !isEqualList(list, old)) {
              this.updateState();
            }
          },
          immediate: true
        }
      },
      events: [{
        name: 'click',
        delegate: function () {
          return "[" + this.attrItem + "],[data-" + this.attrItem + "]";
        },
        handler: function (e) {
          e.preventDefault();
          this.apply(e.current);
        }
      }],
      methods: {
        apply: function (el) {
          var prevState = this.getState();
          var newState = mergeState(el, this.attrItem, this.getState());

          if (!isEqualState(prevState, newState)) {
            this.setState(newState);
          }
        },
        getState: function () {
          var this$1$1 = this;
          return this.toggles.filter(function (item) {
            return hasClass(item, this$1$1.cls);
          }).reduce(function (state, el) {
            return mergeState(el, this$1$1.attrItem, state);
          }, {
            filter: {
              '': ''
            },
            sort: []
          });
        },
        setState: function (state, animate) {
          var this$1$1 = this;
          if (animate === void 0) animate = true;
          state = assign({
            filter: {
              '': ''
            },
            sort: []
          }, state);
          trigger(this.$el, 'beforeFilter', [this, state]);
          this.toggles.forEach(function (el) {
            return toggleClass(el, this$1$1.cls, !!matchFilter(el, this$1$1.attrItem, state));
          });
          Promise$1.all($$(this.target, this.$el).map(function (target) {
            var filterFn = function () {
              applyState(state, target, children(target));
              this$1$1.$update(this$1$1.$el);
            };

            return animate ? this$1$1.animate(filterFn, target) : filterFn();
          })).then(function () {
            return trigger(this$1$1.$el, 'afterFilter', [this$1$1]);
          });
        },
        updateState: function () {
          var this$1$1 = this;
          fastdom.write(function () {
            return this$1$1.setState(this$1$1.getState(), false);
          });
        }
      }
    };

    function getFilter(el, attr) {
      return parseOptions(data(el, attr), ['filter']);
    }

    function isEqualState(stateA, stateB) {
      return ['filter', 'sort'].every(function (prop) {
        return isEqual(stateA[prop], stateB[prop]);
      });
    }

    function applyState(state, target, children) {
      var selector = getSelector(state);
      children.forEach(function (el) {
        return css(el, 'display', selector && !matches(el, selector) ? 'none' : '');
      });
      var ref = state.sort;
      var sort = ref[0];
      var order = ref[1];

      if (sort) {
        var sorted = sortItems(children, sort, order);

        if (!isEqual(sorted, children)) {
          append(target, sorted);
        }
      }
    }

    function mergeState(el, attr, state) {
      var filterBy = getFilter(el, attr);
      var filter = filterBy.filter;
      var group = filterBy.group;
      var sort = filterBy.sort;
      var order = filterBy.order;
      if (order === void 0) order = 'asc';

      if (filter || isUndefined(sort)) {
        if (group) {
          if (filter) {
            delete state.filter[''];
            state.filter[group] = filter;
          } else {
            delete state.filter[group];

            if (isEmpty(state.filter) || '' in state.filter) {
              state.filter = {
                '': filter || ''
              };
            }
          }
        } else {
          state.filter = {
            '': filter || ''
          };
        }
      }

      if (!isUndefined(sort)) {
        state.sort = [sort, order];
      }

      return state;
    }

    function matchFilter(el, attr, ref) {
      var stateFilter = ref.filter;
      if (stateFilter === void 0) stateFilter = {
        '': ''
      };
      var ref_sort = ref.sort;
      var stateSort = ref_sort[0];
      var stateOrder = ref_sort[1];
      var ref$1 = getFilter(el, attr);
      var filter = ref$1.filter;
      if (filter === void 0) filter = '';
      var group = ref$1.group;
      if (group === void 0) group = '';
      var sort = ref$1.sort;
      var order = ref$1.order;
      if (order === void 0) order = 'asc';
      return isUndefined(sort) ? group in stateFilter && filter === stateFilter[group] || !filter && group && !(group in stateFilter) && !stateFilter[''] : stateSort === sort && stateOrder === order;
    }

    function isEqualList(listA, listB) {
      return listA.length === listB.length && listA.every(function (el) {
        return ~listB.indexOf(el);
      });
    }

    function getSelector(ref) {
      var filter = ref.filter;
      var selector = '';
      each(filter, function (value) {
        return selector += value || '';
      });
      return selector;
    }

    function sortItems(nodes, sort, order) {
      return assign([], nodes).sort(function (a, b) {
        return data(a, sort).localeCompare(data(b, sort), undefined, {
          numeric: true
        }) * (order === 'asc' || -1);
      });
    }

    var Animations$2 = {
      slide: {
        show: function (dir) {
          return [{
            transform: translate(dir * -100)
          }, {
            transform: translate()
          }];
        },
        percent: function (current) {
          return translated(current);
        },
        translate: function (percent, dir) {
          return [{
            transform: translate(dir * -100 * percent)
          }, {
            transform: translate(dir * 100 * (1 - percent))
          }];
        }
      }
    };

    function translated(el) {
      return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
    }

    function translate(value, unit) {
      if (value === void 0) value = 0;
      if (unit === void 0) unit = '%';
      value += value ? unit : '';
      return isIE ? "translateX(" + value + ")" : "translate3d(" + value + ", 0, 0)"; // currently not translate3d in IE, translate3d within translate3d does not work while transitioning
    }

    function scale3d(value) {
      return "scale3d(" + value + ", " + value + ", 1)";
    }

    var Animations$1 = assign({}, Animations$2, {
      fade: {
        show: function () {
          return [{
            opacity: 0
          }, {
            opacity: 1
          }];
        },
        percent: function (current) {
          return 1 - css(current, 'opacity');
        },
        translate: function (percent) {
          return [{
            opacity: 1 - percent
          }, {
            opacity: percent
          }];
        }
      },
      scale: {
        show: function () {
          return [{
            opacity: 0,
            transform: scale3d(1 - .2)
          }, {
            opacity: 1,
            transform: scale3d(1)
          }];
        },
        percent: function (current) {
          return 1 - css(current, 'opacity');
        },
        translate: function (percent) {
          return [{
            opacity: 1 - percent,
            transform: scale3d(1 - .2 * percent)
          }, {
            opacity: percent,
            transform: scale3d(1 - .2 + .2 * percent)
          }];
        }
      }
    });

    function Transitioner$1(prev, next, dir, ref) {
      var animation = ref.animation;
      var easing = ref.easing;
      var percent = animation.percent;
      var translate = animation.translate;
      var show = animation.show;
      if (show === void 0) show = noop;
      var props = show(dir);
      var deferred = new Deferred();
      return {
        dir: dir,
        show: function (duration, percent, linear) {
          var this$1$1 = this;
          if (percent === void 0) percent = 0;
          var timing = linear ? 'linear' : easing;
          duration -= Math.round(duration * clamp(percent, -1, 1));
          this.translate(percent);
          triggerUpdate$1(next, 'itemin', {
            percent: percent,
            duration: duration,
            timing: timing,
            dir: dir
          });
          triggerUpdate$1(prev, 'itemout', {
            percent: 1 - percent,
            duration: duration,
            timing: timing,
            dir: dir
          });
          Promise$1.all([Transition.start(next, props[1], duration, timing), Transition.start(prev, props[0], duration, timing)]).then(function () {
            this$1$1.reset();
            deferred.resolve();
          }, noop);
          return deferred.promise;
        },
        cancel: function () {
          Transition.cancel([next, prev]);
        },
        reset: function () {
          for (var prop in props[0]) {
            css([next, prev], prop, '');
          }
        },
        forward: function (duration, percent) {
          if (percent === void 0) percent = this.percent();
          Transition.cancel([next, prev]);
          return this.show(duration, percent, true);
        },
        translate: function (percent) {
          this.reset();
          var props = translate(percent, dir);
          css(next, props[1]);
          css(prev, props[0]);
          triggerUpdate$1(next, 'itemtranslatein', {
            percent: percent,
            dir: dir
          });
          triggerUpdate$1(prev, 'itemtranslateout', {
            percent: 1 - percent,
            dir: dir
          });
        },
        percent: function () {
          return percent(prev || next, next, dir);
        },
        getDistance: function () {
          return prev && prev.offsetWidth;
        }
      };
    }

    function triggerUpdate$1(el, type, data) {
      trigger(el, createEvent(type, false, false, data));
    }

    var SliderAutoplay = {
      props: {
        autoplay: Boolean,
        autoplayInterval: Number,
        pauseOnHover: Boolean
      },
      data: {
        autoplay: false,
        autoplayInterval: 7000,
        pauseOnHover: true
      },
      connected: function () {
        this.autoplay && this.startAutoplay();
      },
      disconnected: function () {
        this.stopAutoplay();
      },
      update: function () {
        attr(this.slides, 'tabindex', '-1');
      },
      events: [{
        name: 'visibilitychange',
        el: function () {
          return document;
        },
        filter: function () {
          return this.autoplay;
        },
        handler: function () {
          if (document.hidden) {
            this.stopAutoplay();
          } else {
            this.startAutoplay();
          }
        }
      }],
      methods: {
        startAutoplay: function () {
          var this$1$1 = this;
          this.stopAutoplay();
          this.interval = setInterval(function () {
            return (!this$1$1.draggable || !$(':focus', this$1$1.$el)) && (!this$1$1.pauseOnHover || !matches(this$1$1.$el, ':hover')) && !this$1$1.stack.length && this$1$1.show('next');
          }, this.autoplayInterval);
        },
        stopAutoplay: function () {
          this.interval && clearInterval(this.interval);
        }
      }
    };
    var SliderDrag = {
      props: {
        draggable: Boolean
      },
      data: {
        draggable: true,
        threshold: 10
      },
      created: function () {
        var this$1$1 = this;
        ['start', 'move', 'end'].forEach(function (key) {
          var fn = this$1$1[key];

          this$1$1[key] = function (e) {
            var pos = getEventPos(e).x * (isRtl ? -1 : 1);
            this$1$1.prevPos = pos !== this$1$1.pos ? this$1$1.pos : this$1$1.prevPos;
            this$1$1.pos = pos;
            fn(e);
          };
        });
      },
      events: [{
        name: pointerDown,
        delegate: function () {
          return this.selSlides;
        },
        handler: function (e) {
          if (!this.draggable || !isTouch(e) && hasTextNodesOnly(e.target) || closest(e.target, selInput) || e.button > 0 || this.length < 2) {
            return;
          }

          this.start(e);
        }
      }, {
        name: 'dragstart',
        handler: function (e) {
          e.preventDefault();
        }
      }],
      methods: {
        start: function () {
          this.drag = this.pos;

          if (this._transitioner) {
            this.percent = this._transitioner.percent();
            this.drag += this._transitioner.getDistance() * this.percent * this.dir;

            this._transitioner.cancel();

            this._transitioner.translate(this.percent);

            this.dragging = true;
            this.stack = [];
          } else {
            this.prevIndex = this.index;
          }

          on(document, pointerMove, this.move, {
            passive: false
          }); // 'input' event is triggered by video controls

          on(document, pointerUp + " " + pointerCancel + " input", this.end, true);
          css(this.list, 'userSelect', 'none');
        },
        move: function (e) {
          var this$1$1 = this;
          var distance = this.pos - this.drag;

          if (distance === 0 || this.prevPos === this.pos || !this.dragging && Math.abs(distance) < this.threshold) {
            return;
          } // prevent click event


          css(this.list, 'pointerEvents', 'none');
          e.cancelable && e.preventDefault();
          this.dragging = true;
          this.dir = distance < 0 ? 1 : -1;
          var ref = this;
          var slides = ref.slides;
          var ref$1 = this;
          var prevIndex = ref$1.prevIndex;
          var dis = Math.abs(distance);
          var nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
          var width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;

          while (nextIndex !== prevIndex && dis > width) {
            this.drag -= width * this.dir;
            prevIndex = nextIndex;
            dis -= width;
            nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
            width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;
          }

          this.percent = dis / width;
          var prev = slides[prevIndex];
          var next = slides[nextIndex];
          var changed = this.index !== nextIndex;
          var edge = prevIndex === nextIndex;
          var itemShown;
          [this.index, this.prevIndex].filter(function (i) {
            return !includes([nextIndex, prevIndex], i);
          }).forEach(function (i) {
            trigger(slides[i], 'itemhidden', [this$1$1]);

            if (edge) {
              itemShown = true;
              this$1$1.prevIndex = prevIndex;
            }
          });

          if (this.index === prevIndex && this.prevIndex !== prevIndex || itemShown) {
            trigger(slides[this.index], 'itemshown', [this]);
          }

          if (changed) {
            this.prevIndex = prevIndex;
            this.index = nextIndex;
            !edge && trigger(prev, 'beforeitemhide', [this]);
            trigger(next, 'beforeitemshow', [this]);
          }

          this._transitioner = this._translate(Math.abs(this.percent), prev, !edge && next);

          if (changed) {
            !edge && trigger(prev, 'itemhide', [this]);
            trigger(next, 'itemshow', [this]);
          }
        },
        end: function () {
          off(document, pointerMove, this.move, {
            passive: false
          });
          off(document, pointerUp + " " + pointerCancel + " input", this.end, true);

          if (this.dragging) {
            this.dragging = null;

            if (this.index === this.prevIndex) {
              this.percent = 1 - this.percent;
              this.dir *= -1;

              this._show(false, this.index, true);

              this._transitioner = null;
            } else {
              var dirChange = (isRtl ? this.dir * (isRtl ? 1 : -1) : this.dir) < 0 === this.prevPos > this.pos;
              this.index = dirChange ? this.index : this.prevIndex;

              if (dirChange) {
                this.percent = 1 - this.percent;
              }

              this.show(this.dir > 0 && !dirChange || this.dir < 0 && dirChange ? 'next' : 'previous', true);
            }
          }

          css(this.list, {
            userSelect: '',
            pointerEvents: ''
          });
          this.drag = this.percent = null;
        }
      }
    };

    function hasTextNodesOnly(el) {
      return !el.children.length && el.childNodes.length;
    }

    var SliderNav = {
      data: {
        selNav: false
      },
      computed: {
        nav: function (ref, $el) {
          var selNav = ref.selNav;
          return $(selNav, $el);
        },
        selNavItem: function (ref) {
          var attrItem = ref.attrItem;
          return "[" + attrItem + "],[data-" + attrItem + "]";
        },
        navItems: function (_, $el) {
          return $$(this.selNavItem, $el);
        }
      },
      update: {
        write: function () {
          var this$1$1 = this;

          if (this.nav && this.length !== this.nav.children.length) {
            html(this.nav, this.slides.map(function (_, i) {
              return "<li " + this$1$1.attrItem + "=\"" + i + "\"><a href></a></li>";
            }).join(''));
          }

          this.navItems.concat(this.nav).forEach(function (el) {
            return el && (el.hidden = !this$1$1.maxIndex);
          });
          this.updateNav();
        },
        events: ['resize']
      },
      events: [{
        name: 'click',
        delegate: function () {
          return this.selNavItem;
        },
        handler: function (e) {
          e.preventDefault();
          this.show(data(e.current, this.attrItem));
        }
      }, {
        name: 'itemshow',
        handler: 'updateNav'
      }],
      methods: {
        updateNav: function () {
          var this$1$1 = this;
          var i = this.getValidIndex();
          this.navItems.forEach(function (el) {
            var cmd = data(el, this$1$1.attrItem);
            toggleClass(el, this$1$1.clsActive, toNumber(cmd) === i);
            toggleClass(el, 'uk-invisible', this$1$1.finite && (cmd === 'previous' && i === 0 || cmd === 'next' && i >= this$1$1.maxIndex));
          });
        }
      }
    };
    var Slider = {
      mixins: [SliderAutoplay, SliderDrag, SliderNav],
      props: {
        clsActivated: Boolean,
        easing: String,
        index: Number,
        finite: Boolean,
        velocity: Number,
        selSlides: String
      },
      data: function () {
        return {
          easing: 'ease',
          finite: false,
          velocity: 1,
          index: 0,
          prevIndex: -1,
          stack: [],
          percent: 0,
          clsActive: 'uk-active',
          clsActivated: false,
          Transitioner: false,
          transitionOptions: {}
        };
      },
      connected: function () {
        this.prevIndex = -1;
        this.index = this.getValidIndex(this.$props.index);
        this.stack = [];
      },
      disconnected: function () {
        removeClass(this.slides, this.clsActive);
      },
      computed: {
        duration: function (ref, $el) {
          var velocity = ref.velocity;
          return speedUp($el.offsetWidth / velocity);
        },
        list: function (ref, $el) {
          var selList = ref.selList;
          return $(selList, $el);
        },
        maxIndex: function () {
          return this.length - 1;
        },
        selSlides: function (ref) {
          var selList = ref.selList;
          var selSlides = ref.selSlides;
          return selList + " " + (selSlides || '> *');
        },
        slides: {
          get: function () {
            return $$(this.selSlides, this.$el);
          },
          watch: function () {
            this.$reset();
          }
        },
        length: function () {
          return this.slides.length;
        }
      },
      events: {
        itemshown: function () {
          this.$update(this.list);
        }
      },
      methods: {
        show: function (index, force) {
          var this$1$1 = this;
          if (force === void 0) force = false;

          if (this.dragging || !this.length) {
            return;
          }

          var ref = this;
          var stack = ref.stack;
          var queueIndex = force ? 0 : stack.length;

          var reset = function () {
            stack.splice(queueIndex, 1);

            if (stack.length) {
              this$1$1.show(stack.shift(), true);
            }
          };

          stack[force ? 'unshift' : 'push'](index);

          if (!force && stack.length > 1) {
            if (stack.length === 2) {
              this._transitioner.forward(Math.min(this.duration, 200));
            }

            return;
          }

          var prevIndex = this.getIndex(this.index);
          var prev = hasClass(this.slides, this.clsActive) && this.slides[prevIndex];
          var nextIndex = this.getIndex(index, this.index);
          var next = this.slides[nextIndex];

          if (prev === next) {
            reset();
            return;
          }

          this.dir = getDirection(index, prevIndex);
          this.prevIndex = prevIndex;
          this.index = nextIndex;

          if (prev && !trigger(prev, 'beforeitemhide', [this]) || !trigger(next, 'beforeitemshow', [this, prev])) {
            this.index = this.prevIndex;
            reset();
            return;
          }

          var promise = this._show(prev, next, force).then(function () {
            prev && trigger(prev, 'itemhidden', [this$1$1]);
            trigger(next, 'itemshown', [this$1$1]);
            return new Promise$1(function (resolve) {
              fastdom.write(function () {
                stack.shift();

                if (stack.length) {
                  this$1$1.show(stack.shift(), true);
                } else {
                  this$1$1._transitioner = null;
                }

                resolve();
              });
            });
          });

          prev && trigger(prev, 'itemhide', [this]);
          trigger(next, 'itemshow', [this]);
          return promise;
        },
        getIndex: function (index, prev) {
          if (index === void 0) index = this.index;
          if (prev === void 0) prev = this.index;
          return clamp(getIndex(index, this.slides, prev, this.finite), 0, this.maxIndex);
        },
        getValidIndex: function (index, prevIndex) {
          if (index === void 0) index = this.index;
          if (prevIndex === void 0) prevIndex = this.prevIndex;
          return this.getIndex(index, prevIndex);
        },
        _show: function (prev, next, force) {
          this._transitioner = this._getTransitioner(prev, next, this.dir, assign({
            easing: force ? next.offsetWidth < 600 ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            /* easeOutQuad */
            : 'cubic-bezier(0.165, 0.84, 0.44, 1)'
            /* easeOutQuart */
            : this.easing
          }, this.transitionOptions));

          if (!force && !prev) {
            this._translate(1);

            return Promise$1.resolve();
          }

          var ref = this.stack;
          var length = ref.length;
          return this._transitioner[length > 1 ? 'forward' : 'show'](length > 1 ? Math.min(this.duration, 75 + 75 / (length - 1)) : this.duration, this.percent);
        },
        _getDistance: function (prev, next) {
          return this._getTransitioner(prev, prev !== next && next).getDistance();
        },
        _translate: function (percent, prev, next) {
          if (prev === void 0) prev = this.prevIndex;
          if (next === void 0) next = this.index;

          var transitioner = this._getTransitioner(prev !== next ? prev : false, next);

          transitioner.translate(percent);
          return transitioner;
        },
        _getTransitioner: function (prev, next, dir, options) {
          if (prev === void 0) prev = this.prevIndex;
          if (next === void 0) next = this.index;
          if (dir === void 0) dir = this.dir || 1;
          if (options === void 0) options = this.transitionOptions;
          return new this.Transitioner(isNumber(prev) ? this.slides[prev] : prev, isNumber(next) ? this.slides[next] : next, dir * (isRtl ? -1 : 1), options);
        }
      }
    };

    function getDirection(index, prevIndex) {
      return index === 'next' ? 1 : index === 'previous' ? -1 : index < prevIndex ? -1 : 1;
    }

    function speedUp(x) {
      return .5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
    }

    var Slideshow = {
      mixins: [Slider],
      props: {
        animation: String
      },
      data: {
        animation: 'slide',
        clsActivated: 'uk-transition-active',
        Animations: Animations$2,
        Transitioner: Transitioner$1
      },
      computed: {
        animation: function (ref) {
          var animation = ref.animation;
          var Animations = ref.Animations;
          return assign(Animations[animation] || Animations.slide, {
            name: animation
          });
        },
        transitionOptions: function () {
          return {
            animation: this.animation
          };
        }
      },
      events: {
        'itemshow itemhide itemshown itemhidden': function (ref) {
          var target = ref.target;
          this.$update(target);
        },
        beforeitemshow: function (ref) {
          var target = ref.target;
          addClass(target, this.clsActive);
        },
        itemshown: function (ref) {
          var target = ref.target;
          addClass(target, this.clsActivated);
        },
        itemhidden: function (ref) {
          var target = ref.target;
          removeClass(target, this.clsActive, this.clsActivated);
        }
      }
    };
    var LightboxPanel = {
      mixins: [Container, Modal, Togglable, Slideshow],
      functional: true,
      props: {
        delayControls: Number,
        preload: Number,
        videoAutoplay: Boolean,
        template: String
      },
      data: function () {
        return {
          preload: 1,
          videoAutoplay: false,
          delayControls: 3000,
          items: [],
          cls: 'uk-open',
          clsPage: 'uk-lightbox-page',
          selList: '.uk-lightbox-items',
          attrItem: 'uk-lightbox-item',
          selClose: '.uk-close-large',
          selCaption: '.uk-lightbox-caption',
          pauseOnHover: false,
          velocity: 2,
          Animations: Animations$1,
          template: "<div class=\"uk-lightbox uk-overflow-hidden\"> <ul class=\"uk-lightbox-items\"></ul> <div class=\"uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque\"> <button class=\"uk-lightbox-toolbar-icon uk-close-large\" type=\"button\" uk-close></button> </div> <a class=\"uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade\" href uk-slidenav-previous uk-lightbox-item=\"previous\"></a> <a class=\"uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade\" href uk-slidenav-next uk-lightbox-item=\"next\"></a> <div class=\"uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque\"></div> </div>"
        };
      },
      created: function () {
        var $el = $(this.template);
        var list = $(this.selList, $el);
        this.items.forEach(function () {
          return append(list, '<li>');
        });
        this.$mount(append(this.container, $el));
      },
      computed: {
        caption: function (ref, $el) {
          var selCaption = ref.selCaption;
          return $(selCaption, $el);
        }
      },
      events: [{
        name: pointerMove + " " + pointerDown + " keydown",
        handler: 'showControls'
      }, {
        name: 'click',
        self: true,
        delegate: function () {
          return this.selSlides;
        },
        handler: function (e) {
          if (e.defaultPrevented) {
            return;
          }

          this.hide();
        }
      }, {
        name: 'shown',
        self: true,
        handler: function () {
          this.showControls();
        }
      }, {
        name: 'hide',
        self: true,
        handler: function () {
          this.hideControls();
          removeClass(this.slides, this.clsActive);
          Transition.stop(this.slides);
        }
      }, {
        name: 'hidden',
        self: true,
        handler: function () {
          this.$destroy(true);
        }
      }, {
        name: 'keyup',
        el: function () {
          return document;
        },
        handler: function (e) {
          if (!this.isToggled(this.$el) || !this.draggable) {
            return;
          }

          switch (e.keyCode) {
            case 37:
              this.show('previous');
              break;

            case 39:
              this.show('next');
              break;
          }
        }
      }, {
        name: 'beforeitemshow',
        handler: function (e) {
          if (this.isToggled()) {
            return;
          }

          this.draggable = false;
          e.preventDefault();
          this.toggleElement(this.$el, true, false);
          this.animation = Animations$1['scale'];
          removeClass(e.target, this.clsActive);
          this.stack.splice(1, 0, this.index);
        }
      }, {
        name: 'itemshow',
        handler: function () {
          html(this.caption, this.getItem().caption || '');

          for (var j = -this.preload; j <= this.preload; j++) {
            this.loadItem(this.index + j);
          }
        }
      }, {
        name: 'itemshown',
        handler: function () {
          this.draggable = this.$props.draggable;
        }
      }, {
        name: 'itemload',
        handler: function (_, item) {
          var this$1$1 = this;
          var src = item.source;
          var type = item.type;
          var alt = item.alt;
          if (alt === void 0) alt = '';
          var poster = item.poster;
          var attrs = item.attrs;
          if (attrs === void 0) attrs = {};
          this.setItem(item, '<span uk-spinner></span>');

          if (!src) {
            return;
          }

          var matches;
          var iframeAttrs = {
            frameborder: '0',
            allow: 'autoplay',
            allowfullscreen: '',
            style: 'max-width: 100%; box-sizing: border-box;',
            'uk-responsive': '',
            'uk-video': "" + this.videoAutoplay
          }; // Image

          if (type === 'image' || src.match(/\.(avif|jpe?g|a?png|gif|svg|webp)($|\?)/i)) {
            getImage(src, attrs.srcset, attrs.size).then(function (ref) {
              var width = ref.width;
              var height = ref.height;
              return this$1$1.setItem(item, createEl('img', assign({
                src: src,
                width: width,
                height: height,
                alt: alt
              }, attrs)));
            }, function () {
              return this$1$1.setError(item);
            }); // Video
          } else if (type === 'video' || src.match(/\.(mp4|webm|ogv)($|\?)/i)) {
            var video = createEl('video', assign({
              src: src,
              poster: poster,
              controls: '',
              playsinline: '',
              'uk-video': "" + this.videoAutoplay
            }, attrs));
            on(video, 'loadedmetadata', function () {
              attr(video, {
                width: video.videoWidth,
                height: video.videoHeight
              });
              this$1$1.setItem(item, video);
            });
            on(video, 'error', function () {
              return this$1$1.setError(item);
            }); // Iframe
          } else if (type === 'iframe' || src.match(/\.(html|php)($|\?)/i)) {
            this.setItem(item, createEl('iframe', assign({
              src: src,
              frameborder: '0',
              allowfullscreen: '',
              class: 'uk-lightbox-iframe'
            }, attrs))); // YouTube
          } else if (matches = src.match(/\/\/(?:.*?youtube(-nocookie)?\..*?[?&]v=|youtu\.be\/)([\w-]{11})[&?]?(.*)?/)) {
            this.setItem(item, createEl('iframe', assign({
              src: "https://www.youtube" + (matches[1] || '') + ".com/embed/" + matches[2] + (matches[3] ? "?" + matches[3] : ''),
              width: 1920,
              height: 1080
            }, iframeAttrs, attrs))); // Vimeo
          } else if (matches = src.match(/\/\/.*?vimeo\.[a-z]+\/(\d+)[&?]?(.*)?/)) {
            ajax("https://vimeo.com/api/oembed.json?maxwidth=1920&url=" + encodeURI(src), {
              responseType: 'json',
              withCredentials: false
            }).then(function (ref) {
              var ref_response = ref.response;
              var height = ref_response.height;
              var width = ref_response.width;
              return this$1$1.setItem(item, createEl('iframe', assign({
                src: "https://player.vimeo.com/video/" + matches[1] + (matches[2] ? "?" + matches[2] : ''),
                width: width,
                height: height
              }, iframeAttrs, attrs)));
            }, function () {
              return this$1$1.setError(item);
            });
          }
        }
      }],
      methods: {
        loadItem: function (index) {
          if (index === void 0) index = this.index;
          var item = this.getItem(index);

          if (!this.getSlide(item).childElementCount) {
            trigger(this.$el, 'itemload', [item]);
          }
        },
        getItem: function (index) {
          if (index === void 0) index = this.index;
          return this.items[getIndex(index, this.slides)];
        },
        setItem: function (item, content) {
          trigger(this.$el, 'itemloaded', [this, html(this.getSlide(item), content)]);
        },
        getSlide: function (item) {
          return this.slides[this.items.indexOf(item)];
        },
        setError: function (item) {
          this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
        },
        showControls: function () {
          clearTimeout(this.controlsTimer);
          this.controlsTimer = setTimeout(this.hideControls, this.delayControls);
          addClass(this.$el, 'uk-active', 'uk-transition-active');
        },
        hideControls: function () {
          removeClass(this.$el, 'uk-active', 'uk-transition-active');
        }
      }
    };

    function createEl(tag, attrs) {
      var el = fragment("<" + tag + ">");
      attr(el, attrs);
      return el;
    }

    var lightbox = {
      install: install$1,
      props: {
        toggle: String
      },
      data: {
        toggle: 'a'
      },
      computed: {
        toggles: {
          get: function (ref, $el) {
            var toggle = ref.toggle;
            return $$(toggle, $el);
          },
          watch: function () {
            this.hide();
          }
        }
      },
      disconnected: function () {
        this.hide();
      },
      events: [{
        name: 'click',
        delegate: function () {
          return this.toggle + ":not(.uk-disabled)";
        },
        handler: function (e) {
          e.preventDefault();
          this.show(e.current);
        }
      }],
      methods: {
        show: function (index) {
          var this$1$1 = this;
          var items = uniqueBy(this.toggles.map(toItem), 'source');

          if (isElement(index)) {
            var ref = toItem(index);
            var source = ref.source;
            index = findIndex(items, function (ref) {
              var src = ref.source;
              return source === src;
            });
          }

          this.panel = this.panel || this.$create('lightboxPanel', assign({}, this.$props, {
            items: items
          }));
          on(this.panel.$el, 'hidden', function () {
            return this$1$1.panel = false;
          });
          return this.panel.show(index);
        },
        hide: function () {
          return this.panel && this.panel.hide();
        }
      }
    };

    function install$1(UIkit, Lightbox) {
      if (!UIkit.lightboxPanel) {
        UIkit.component('lightboxPanel', LightboxPanel);
      }

      assign(Lightbox.props, UIkit.component('lightboxPanel').options.props);
    }

    function toItem(el) {
      var item = {};
      ['href', 'caption', 'type', 'poster', 'alt', 'attrs'].forEach(function (attr) {
        item[attr === 'href' ? 'source' : attr] = data(el, attr);
      });
      item.attrs = parseOptions(item.attrs);
      return item;
    }

    var obj$1;
    var notification = {
      mixins: [Container],
      functional: true,
      args: ['message', 'status'],
      data: {
        message: '',
        status: '',
        timeout: 5000,
        group: null,
        pos: 'top-center',
        clsContainer: 'uk-notification',
        clsClose: 'uk-notification-close',
        clsMsg: 'uk-notification-message'
      },
      install: install,
      computed: {
        marginProp: function (ref) {
          var pos = ref.pos;
          return "margin" + (startsWith(pos, 'top') ? 'Top' : 'Bottom');
        },
        startProps: function () {
          var obj;
          return obj = {
            opacity: 0
          }, obj[this.marginProp] = -this.$el.offsetHeight, obj;
        }
      },
      created: function () {
        var container = $("." + this.clsContainer + "-" + this.pos, this.container) || append(this.container, "<div class=\"" + this.clsContainer + " " + this.clsContainer + "-" + this.pos + "\" style=\"display: block\"></div>");
        this.$mount(append(container, "<div class=\"" + this.clsMsg + (this.status ? " " + this.clsMsg + "-" + this.status : '') + "\"> <a href class=\"" + this.clsClose + "\" data-uk-close></a> <div>" + this.message + "</div> </div>"));
      },
      connected: function () {
        var this$1$1 = this;
        var obj;
        var margin = toFloat(css(this.$el, this.marginProp));
        Transition.start(css(this.$el, this.startProps), (obj = {
          opacity: 1
        }, obj[this.marginProp] = margin, obj)).then(function () {
          if (this$1$1.timeout) {
            this$1$1.timer = setTimeout(this$1$1.close, this$1$1.timeout);
          }
        });
      },
      events: (obj$1 = {
        click: function (e) {
          if (closest(e.target, 'a[href="#"],a[href=""]')) {
            e.preventDefault();
          }

          this.close();
        }
      }, obj$1[pointerEnter] = function () {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      }, obj$1[pointerLeave] = function () {
        if (this.timeout) {
          this.timer = setTimeout(this.close, this.timeout);
        }
      }, obj$1),
      methods: {
        close: function (immediate) {
          var this$1$1 = this;

          var removeFn = function (el) {
            var container = parent(el);
            trigger(el, 'close', [this$1$1]);
            remove$1(el);

            if (container && !container.hasChildNodes()) {
              remove$1(container);
            }
          };

          if (this.timer) {
            clearTimeout(this.timer);
          }

          if (immediate) {
            removeFn(this.$el);
          } else {
            Transition.start(this.$el, this.startProps).then(removeFn);
          }
        }
      }
    };

    function install(UIkit) {
      UIkit.notification.closeAll = function (group, immediate) {
        apply$1(document.body, function (el) {
          var notification = UIkit.getComponent(el, 'notification');

          if (notification && (!group || group === notification.group)) {
            notification.close(immediate);
          }
        });
      };
    }

    var props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity', 'stroke'];
    var Parallax = {
      mixins: [Media],
      props: props.reduce(function (props, prop) {
        props[prop] = 'list';
        return props;
      }, {}),
      data: props.reduce(function (data, prop) {
        data[prop] = undefined;
        return data;
      }, {}),
      computed: {
        props: function (properties, $el) {
          var this$1$1 = this;
          return props.reduce(function (props, prop) {
            if (isUndefined(properties[prop])) {
              return props;
            }

            var isColor = prop.match(/color/i);
            var isCssProp = isColor || prop === 'opacity';
            var pos, bgPos, diff;
            var steps = properties[prop].slice();

            if (isCssProp) {
              css($el, prop, '');
            }

            if (steps.length < 2) {
              steps.unshift((prop === 'scale' ? 1 : isCssProp ? css($el, prop) : 0) || 0);
            }

            var unit = getUnit(steps);

            if (isColor) {
              var ref = $el.style;
              var color = ref.color;
              steps = steps.map(function (step) {
                return parseColor($el, step);
              });
              $el.style.color = color;
            } else if (startsWith(prop, 'bg')) {
              var attr = prop === 'bgy' ? 'height' : 'width';
              steps = steps.map(function (step) {
                return toPx(step, attr, this$1$1.$el);
              });
              css($el, "background-position-" + prop[2], '');
              bgPos = css($el, 'backgroundPosition').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

              if (this$1$1.covers) {
                var min = Math.min.apply(Math, steps);
                var max = Math.max.apply(Math, steps);
                var down = steps.indexOf(min) < steps.indexOf(max);
                diff = max - min;
                steps = steps.map(function (step) {
                  return step - (down ? min : max);
                });
                pos = (down ? -diff : 0) + "px";
              } else {
                pos = bgPos;
              }
            } else {
              steps = steps.map(toFloat);
            }

            if (prop === 'stroke') {
              if (!steps.some(function (step) {
                return step;
              })) {
                return props;
              }

              var length = getMaxPathLength(this$1$1.$el);
              css($el, 'strokeDasharray', length);

              if (unit === '%') {
                steps = steps.map(function (step) {
                  return step * length / 100;
                });
              }

              steps = steps.reverse();
              prop = 'strokeDashoffset';
            }

            props[prop] = {
              steps: steps,
              unit: unit,
              pos: pos,
              bgPos: bgPos,
              diff: diff
            };
            return props;
          }, {});
        },
        bgProps: function () {
          var this$1$1 = this;
          return ['bgx', 'bgy'].filter(function (bg) {
            return bg in this$1$1.props;
          });
        },
        covers: function (_, $el) {
          return covers($el);
        }
      },
      disconnected: function () {
        delete this._image;
      },
      update: {
        read: function (data) {
          var this$1$1 = this;

          if (!this.matchMedia) {
            return;
          }

          if (!data.image && this.covers && this.bgProps.length) {
            var src = css(this.$el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

            if (src) {
              var img = new Image();
              img.src = src;
              data.image = img;

              if (!img.naturalWidth) {
                img.onload = function () {
                  return this$1$1.$update();
                };
              }
            }
          }

          var image = data.image;

          if (!image || !image.naturalWidth) {
            return;
          }

          var dimEl = {
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight
          };
          var dimImage = {
            width: image.naturalWidth,
            height: image.naturalHeight
          };
          var dim = Dimensions.cover(dimImage, dimEl);
          this.bgProps.forEach(function (prop) {
            var ref = this$1$1.props[prop];
            var diff = ref.diff;
            var bgPos = ref.bgPos;
            var steps = ref.steps;
            var attr = prop === 'bgy' ? 'height' : 'width';
            var span = dim[attr] - dimEl[attr];

            if (span < diff) {
              dimEl[attr] = dim[attr] + diff - span;
            } else if (span > diff) {
              var posPercentage = dimEl[attr] / toPx(bgPos, attr, this$1$1.$el);

              if (posPercentage) {
                this$1$1.props[prop].steps = steps.map(function (step) {
                  return step - (span - diff) / posPercentage;
                });
              }
            }

            dim = Dimensions.cover(dimImage, dimEl);
          });
          data.dim = dim;
        },
        write: function (ref) {
          var dim = ref.dim;

          if (!this.matchMedia) {
            css(this.$el, {
              backgroundSize: '',
              backgroundRepeat: ''
            });
            return;
          }

          dim && css(this.$el, {
            backgroundSize: dim.width + "px " + dim.height + "px",
            backgroundRepeat: 'no-repeat'
          });
        },
        events: ['resize']
      },
      methods: {
        reset: function () {
          var this$1$1 = this;
          each(this.getCss(0), function (_, prop) {
            return css(this$1$1.$el, prop, '');
          });
        },
        getCss: function (percent) {
          var ref = this;
          var props = ref.props;
          return Object.keys(props).reduce(function (css, prop) {
            var ref = props[prop];
            var steps = ref.steps;
            var unit = ref.unit;
            var pos = ref.pos;
            var value = getValue(steps, percent);

            switch (prop) {
              // transforms
              case 'x':
              case 'y':
                {
                  unit = unit || 'px';
                  css.transform += " translate" + ucfirst(prop) + "(" + toFloat(value).toFixed(unit === 'px' ? 0 : 2) + unit + ")";
                  break;
                }

              case 'rotate':
                unit = unit || 'deg';
                css.transform += " rotate(" + (value + unit) + ")";
                break;

              case 'scale':
                css.transform += " scale(" + value + ")";
                break;
              // bg image

              case 'bgy':
              case 'bgx':
                css["background-position-" + prop[2]] = "calc(" + pos + " + " + value + "px)";
                break;
              // color

              case 'color':
              case 'backgroundColor':
              case 'borderColor':
                {
                  var ref$1 = getStep(steps, percent);
                  var start = ref$1[0];
                  var end = ref$1[1];
                  var p = ref$1[2];
                  css[prop] = "rgba(" + start.map(function (value, i) {
                    value = value + p * (end[i] - value);
                    return i === 3 ? toFloat(value) : parseInt(value, 10);
                  }).join(',') + ")";
                  break;
                }
              // CSS Filter

              case 'blur':
                unit = unit || 'px';
                css.filter += " blur(" + (value + unit) + ")";
                break;

              case 'hue':
                unit = unit || 'deg';
                css.filter += " hue-rotate(" + (value + unit) + ")";
                break;

              case 'fopacity':
                unit = unit || '%';
                css.filter += " opacity(" + (value + unit) + ")";
                break;

              case 'grayscale':
              case 'invert':
              case 'saturate':
              case 'sepia':
                unit = unit || '%';
                css.filter += " " + prop + "(" + (value + unit) + ")";
                break;

              default:
                css[prop] = value;
            }

            return css;
          }, {
            transform: '',
            filter: ''
          });
        }
      }
    };

    function parseColor(el, color) {
      return css(css(el, 'color', color), 'color').split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(toFloat);
    }

    function getStep(steps, percent) {
      var count = steps.length - 1;
      var index = Math.min(Math.floor(count * percent), count - 1);
      var step = steps.slice(index, index + 2);
      step.push(percent === 1 ? 1 : percent % (1 / count) * count);
      return step;
    }

    function getValue(steps, percent, digits) {
      if (digits === void 0) digits = 2;
      var ref = getStep(steps, percent);
      var start = ref[0];
      var end = ref[1];
      var p = ref[2];
      return (isNumber(start) ? start + Math.abs(start - end) * p * (start < end ? 1 : -1) : +end).toFixed(digits);
    }

    function getUnit(steps) {
      return steps.reduce(function (unit, step) {
        return isString(step) && step.replace(/-|\d/g, '').trim() || unit;
      }, '');
    }

    function covers(el) {
      var ref = el.style;
      var backgroundSize = ref.backgroundSize;
      var covers = css(css(el, 'backgroundSize', ''), 'backgroundSize') === 'cover';
      el.style.backgroundSize = backgroundSize;
      return covers;
    }

    var parallax = {
      mixins: [Parallax],
      props: {
        target: String,
        viewport: Number,
        easing: Number
      },
      data: {
        target: false,
        viewport: 1,
        easing: 1
      },
      computed: {
        target: function (ref, $el) {
          var target = ref.target;
          return getOffsetElement(target && query(target, $el) || $el);
        }
      },
      update: {
        read: function (ref, types) {
          var percent = ref.percent;

          if (!types.has('scroll')) {
            percent = false;
          }

          if (!this.matchMedia) {
            return;
          }

          var prev = percent;
          percent = ease(scrolledOver(this.target) / (this.viewport || 1), this.easing);
          return {
            percent: percent,
            style: prev !== percent ? this.getCss(percent) : false
          };
        },
        write: function (ref) {
          var style = ref.style;

          if (!this.matchMedia) {
            this.reset();
            return;
          }

          style && css(this.$el, style);
        },
        events: ['scroll', 'resize']
      }
    };

    function ease(percent, easing) {
      return clamp(percent * (1 - (easing - easing * percent)));
    } // SVG elements do not inherit from HTMLElement


    function getOffsetElement(el) {
      return el ? 'offsetTop' in el ? el : getOffsetElement(parent(el)) : document.body;
    }

    var SliderReactive = {
      update: {
        write: function () {
          if (this.stack.length || this.dragging) {
            return;
          }

          var index = this.getValidIndex(this.index);

          if (!~this.prevIndex || this.index !== index) {
            this.show(index);
          }
        },
        events: ['resize']
      }
    };

    function Transitioner(prev, next, dir, ref) {
      var center = ref.center;
      var easing = ref.easing;
      var list = ref.list;
      var deferred = new Deferred();
      var from = prev ? getLeft(prev, list, center) : getLeft(next, list, center) + dimensions(next).width * dir;
      var to = next ? getLeft(next, list, center) : from + dimensions(prev).width * dir * (isRtl ? -1 : 1);
      return {
        dir: dir,
        show: function (duration, percent, linear) {
          if (percent === void 0) percent = 0;
          var timing = linear ? 'linear' : easing;
          duration -= Math.round(duration * clamp(percent, -1, 1));
          this.translate(percent);
          percent = prev ? percent : clamp(percent, 0, 1);
          triggerUpdate(this.getItemIn(), 'itemin', {
            percent: percent,
            duration: duration,
            timing: timing,
            dir: dir
          });
          prev && triggerUpdate(this.getItemIn(true), 'itemout', {
            percent: 1 - percent,
            duration: duration,
            timing: timing,
            dir: dir
          });
          Transition.start(list, {
            transform: translate(-to * (isRtl ? -1 : 1), 'px')
          }, duration, timing).then(deferred.resolve, noop);
          return deferred.promise;
        },
        cancel: function () {
          Transition.cancel(list);
        },
        reset: function () {
          css(list, 'transform', '');
        },
        forward: function (duration, percent) {
          if (percent === void 0) percent = this.percent();
          Transition.cancel(list);
          return this.show(duration, percent, true);
        },
        translate: function (percent) {
          var distance = this.getDistance() * dir * (isRtl ? -1 : 1);
          css(list, 'transform', translate(clamp(-to + (distance - distance * percent), -getWidth(list), dimensions(list).width) * (isRtl ? -1 : 1), 'px'));
          var actives = this.getActives();
          var itemIn = this.getItemIn();
          var itemOut = this.getItemIn(true);
          percent = prev ? clamp(percent, -1, 1) : 0;
          children(list).forEach(function (slide) {
            var isActive = includes(actives, slide);
            var isIn = slide === itemIn;
            var isOut = slide === itemOut;
            var translateIn = isIn || !isOut && (isActive || dir * (isRtl ? -1 : 1) === -1 ^ getElLeft(slide, list) > getElLeft(prev || next));
            triggerUpdate(slide, "itemtranslate" + (translateIn ? 'in' : 'out'), {
              dir: dir,
              percent: isOut ? 1 - percent : isIn ? percent : isActive ? 1 : 0
            });
          });
        },
        percent: function () {
          return Math.abs((css(list, 'transform').split(',')[4] * (isRtl ? -1 : 1) + from) / (to - from));
        },
        getDistance: function () {
          return Math.abs(to - from);
        },
        getItemIn: function (out) {
          if (out === void 0) out = false;
          var actives = this.getActives();
          var nextActives = inView(list, getLeft(next || prev, list, center));

          if (out) {
            var temp = actives;
            actives = nextActives;
            nextActives = temp;
          }

          return nextActives[findIndex(nextActives, function (el) {
            return !includes(actives, el);
          })];
        },
        getActives: function () {
          return inView(list, getLeft(prev || next, list, center));
        }
      };
    }

    function getLeft(el, list, center) {
      var left = getElLeft(el, list);
      return center ? left - centerEl(el, list) : Math.min(left, getMax(list));
    }

    function getMax(list) {
      return Math.max(0, getWidth(list) - dimensions(list).width);
    }

    function getWidth(list) {
      return children(list).reduce(function (right, el) {
        return dimensions(el).width + right;
      }, 0);
    }

    function centerEl(el, list) {
      return dimensions(list).width / 2 - dimensions(el).width / 2;
    }

    function getElLeft(el, list) {
      return el && (position(el).left + (isRtl ? dimensions(el).width - dimensions(list).width : 0)) * (isRtl ? -1 : 1) || 0;
    }

    function inView(list, listLeft) {
      listLeft -= 1;
      var listWidth = dimensions(list).width;
      var listRight = listLeft + listWidth + 2;
      return children(list).filter(function (slide) {
        var slideLeft = getElLeft(slide, list);
        var slideRight = slideLeft + Math.min(dimensions(slide).width, listWidth);
        return slideLeft >= listLeft && slideRight <= listRight;
      });
    }

    function triggerUpdate(el, type, data) {
      trigger(el, createEvent(type, false, false, data));
    }

    var slider = {
      mixins: [Class, Slider, SliderReactive],
      props: {
        center: Boolean,
        sets: Boolean
      },
      data: {
        center: false,
        sets: false,
        attrItem: 'uk-slider-item',
        selList: '.uk-slider-items',
        selNav: '.uk-slider-nav',
        clsContainer: 'uk-slider-container',
        Transitioner: Transitioner
      },
      computed: {
        avgWidth: function () {
          return getWidth(this.list) / this.length;
        },
        finite: function (ref) {
          var finite = ref.finite;
          return finite || Math.ceil(getWidth(this.list)) < dimensions(this.list).width + getMaxElWidth(this.list) + this.center;
        },
        maxIndex: function () {
          if (!this.finite || this.center && !this.sets) {
            return this.length - 1;
          }

          if (this.center) {
            return last(this.sets);
          }

          var lft = 0;
          var max = getMax(this.list);
          var index = findIndex(this.slides, function (el) {
            if (lft >= max) {
              return true;
            }

            lft += dimensions(el).width;
          });
          return ~index ? index : this.length - 1;
        },
        sets: function (ref) {
          var this$1$1 = this;
          var sets = ref.sets;

          if (!sets) {
            return;
          }

          var width = dimensions(this.list).width / (this.center ? 2 : 1);
          var left = 0;
          var leftCenter = width;
          var slideLeft = 0;
          sets = sortBy$1(this.slides, 'offsetLeft').reduce(function (sets, slide, i) {
            var slideWidth = dimensions(slide).width;
            var slideRight = slideLeft + slideWidth;

            if (slideRight > left) {
              if (!this$1$1.center && i > this$1$1.maxIndex) {
                i = this$1$1.maxIndex;
              }

              if (!includes(sets, i)) {
                var cmp = this$1$1.slides[i + 1];

                if (this$1$1.center && cmp && slideWidth < leftCenter - dimensions(cmp).width / 2) {
                  leftCenter -= slideWidth;
                } else {
                  leftCenter = width;
                  sets.push(i);
                  left = slideLeft + width + (this$1$1.center ? slideWidth / 2 : 0);
                }
              }
            }

            slideLeft += slideWidth;
            return sets;
          }, []);
          return !isEmpty(sets) && sets;
        },
        transitionOptions: function () {
          return {
            center: this.center,
            list: this.list
          };
        }
      },
      connected: function () {
        toggleClass(this.$el, this.clsContainer, !$("." + this.clsContainer, this.$el));
      },
      update: {
        write: function () {
          var this$1$1 = this;
          this.navItems.forEach(function (el) {
            var index = toNumber(data(el, this$1$1.attrItem));

            if (index !== false) {
              el.hidden = !this$1$1.maxIndex || index > this$1$1.maxIndex || this$1$1.sets && !includes(this$1$1.sets, index);
            }
          });

          if (this.length && !this.dragging && !this.stack.length) {
            this.reorder();

            this._translate(1);
          }

          var actives = this._getTransitioner(this.index).getActives();

          this.slides.forEach(function (slide) {
            return toggleClass(slide, this$1$1.clsActive, includes(actives, slide));
          });

          if (this.clsActivated && (!this.sets || includes(this.sets, toFloat(this.index)))) {
            this.slides.forEach(function (slide) {
              return toggleClass(slide, this$1$1.clsActivated || '', includes(actives, slide));
            });
          }
        },
        events: ['resize']
      },
      events: {
        beforeitemshow: function (e) {
          if (!this.dragging && this.sets && this.stack.length < 2 && !includes(this.sets, this.index)) {
            this.index = this.getValidIndex();
          }

          var diff = Math.abs(this.index - this.prevIndex + (this.dir > 0 && this.index < this.prevIndex || this.dir < 0 && this.index > this.prevIndex ? (this.maxIndex + 1) * this.dir : 0));

          if (!this.dragging && diff > 1) {
            for (var i = 0; i < diff; i++) {
              this.stack.splice(1, 0, this.dir > 0 ? 'next' : 'previous');
            }

            e.preventDefault();
            return;
          }

          var index = this.dir < 0 || !this.slides[this.prevIndex] ? this.index : this.prevIndex;
          this.duration = speedUp(this.avgWidth / this.velocity) * (dimensions(this.slides[index]).width / this.avgWidth);
          this.reorder();
        },
        itemshow: function () {
          if (~this.prevIndex) {
            addClass(this._getTransitioner().getItemIn(), this.clsActive);
          }
        }
      },
      methods: {
        reorder: function () {
          var this$1$1 = this;

          if (this.finite) {
            css(this.slides, 'order', '');
            return;
          }

          var index = this.dir > 0 && this.slides[this.prevIndex] ? this.prevIndex : this.index;
          this.slides.forEach(function (slide, i) {
            return css(slide, 'order', this$1$1.dir > 0 && i < index ? 1 : this$1$1.dir < 0 && i >= this$1$1.index ? -1 : '');
          });

          if (!this.center) {
            return;
          }

          var next = this.slides[index];
          var width = dimensions(this.list).width / 2 - dimensions(next).width / 2;
          var j = 0;

          while (width > 0) {
            var slideIndex = this.getIndex(--j + index, index);
            var slide = this.slides[slideIndex];
            css(slide, 'order', slideIndex > index ? -2 : -1);
            width -= dimensions(slide).width;
          }
        },
        getValidIndex: function (index, prevIndex) {
          if (index === void 0) index = this.index;
          if (prevIndex === void 0) prevIndex = this.prevIndex;
          index = this.getIndex(index, prevIndex);

          if (!this.sets) {
            return index;
          }

          var prev;

          do {
            if (includes(this.sets, index)) {
              return index;
            }

            prev = index;
            index = this.getIndex(index + this.dir, prevIndex);
          } while (index !== prev);

          return index;
        }
      }
    };

    function getMaxElWidth(list) {
      return Math.max.apply(Math, [0].concat(children(list).map(function (el) {
        return dimensions(el).width;
      })));
    }

    var sliderParallax = {
      mixins: [Parallax],
      data: {
        selItem: '!li'
      },
      computed: {
        item: function (ref, $el) {
          var selItem = ref.selItem;
          return query(selItem, $el);
        }
      },
      events: [{
        name: 'itemin itemout',
        self: true,
        el: function () {
          return this.item;
        },
        handler: function (ref) {
          var this$1$1 = this;
          var type = ref.type;
          var ref_detail = ref.detail;
          var percent = ref_detail.percent;
          var duration = ref_detail.duration;
          var timing = ref_detail.timing;
          var dir = ref_detail.dir;
          fastdom.read(function () {
            var propsFrom = this$1$1.getCss(getCurrentPercent(type, dir, percent));
            var propsTo = this$1$1.getCss(isIn(type) ? .5 : dir > 0 ? 1 : 0);
            fastdom.write(function () {
              css(this$1$1.$el, propsFrom);
              Transition.start(this$1$1.$el, propsTo, duration, timing).catch(noop);
            });
          });
        }
      }, {
        name: 'transitioncanceled transitionend',
        self: true,
        el: function () {
          return this.item;
        },
        handler: function () {
          Transition.cancel(this.$el);
        }
      }, {
        name: 'itemtranslatein itemtranslateout',
        self: true,
        el: function () {
          return this.item;
        },
        handler: function (ref) {
          var this$1$1 = this;
          var type = ref.type;
          var ref_detail = ref.detail;
          var percent = ref_detail.percent;
          var dir = ref_detail.dir;
          fastdom.read(function () {
            var props = this$1$1.getCss(getCurrentPercent(type, dir, percent));
            fastdom.write(function () {
              return css(this$1$1.$el, props);
            });
          });
        }
      }]
    };

    function isIn(type) {
      return endsWith(type, 'in');
    }

    function getCurrentPercent(type, dir, percent) {
      percent /= 2;
      return !isIn(type) ? dir < 0 ? percent : 1 - percent : dir < 0 ? 1 - percent : percent;
    }

    var Animations = assign({}, Animations$2, {
      fade: {
        show: function () {
          return [{
            opacity: 0,
            zIndex: 0
          }, {
            zIndex: -1
          }];
        },
        percent: function (current) {
          return 1 - css(current, 'opacity');
        },
        translate: function (percent) {
          return [{
            opacity: 1 - percent,
            zIndex: 0
          }, {
            zIndex: -1
          }];
        }
      },
      scale: {
        show: function () {
          return [{
            opacity: 0,
            transform: scale3d(1 + .5),
            zIndex: 0
          }, {
            zIndex: -1
          }];
        },
        percent: function (current) {
          return 1 - css(current, 'opacity');
        },
        translate: function (percent) {
          return [{
            opacity: 1 - percent,
            transform: scale3d(1 + .5 * percent),
            zIndex: 0
          }, {
            zIndex: -1
          }];
        }
      },
      pull: {
        show: function (dir) {
          return dir < 0 ? [{
            transform: translate(30),
            zIndex: -1
          }, {
            transform: translate(),
            zIndex: 0
          }] : [{
            transform: translate(-100),
            zIndex: 0
          }, {
            transform: translate(),
            zIndex: -1
          }];
        },
        percent: function (current, next, dir) {
          return dir < 0 ? 1 - translated(next) : translated(current);
        },
        translate: function (percent, dir) {
          return dir < 0 ? [{
            transform: translate(30 * percent),
            zIndex: -1
          }, {
            transform: translate(-100 * (1 - percent)),
            zIndex: 0
          }] : [{
            transform: translate(-percent * 100),
            zIndex: 0
          }, {
            transform: translate(30 * (1 - percent)),
            zIndex: -1
          }];
        }
      },
      push: {
        show: function (dir) {
          return dir < 0 ? [{
            transform: translate(100),
            zIndex: 0
          }, {
            transform: translate(),
            zIndex: -1
          }] : [{
            transform: translate(-30),
            zIndex: -1
          }, {
            transform: translate(),
            zIndex: 0
          }];
        },
        percent: function (current, next, dir) {
          return dir > 0 ? 1 - translated(next) : translated(current);
        },
        translate: function (percent, dir) {
          return dir < 0 ? [{
            transform: translate(percent * 100),
            zIndex: 0
          }, {
            transform: translate(-30 * (1 - percent)),
            zIndex: -1
          }] : [{
            transform: translate(-30 * percent),
            zIndex: -1
          }, {
            transform: translate(100 * (1 - percent)),
            zIndex: 0
          }];
        }
      }
    });
    var slideshow = {
      mixins: [Class, Slideshow, SliderReactive],
      props: {
        ratio: String,
        minHeight: Number,
        maxHeight: Number
      },
      data: {
        ratio: '16:9',
        minHeight: false,
        maxHeight: false,
        selList: '.uk-slideshow-items',
        attrItem: 'uk-slideshow-item',
        selNav: '.uk-slideshow-nav',
        Animations: Animations
      },
      update: {
        read: function () {
          var ref = this.ratio.split(':').map(Number);
          var width = ref[0];
          var height = ref[1];
          height = height * this.list.offsetWidth / width || 0;

          if (this.minHeight) {
            height = Math.max(this.minHeight, height);
          }

          if (this.maxHeight) {
            height = Math.min(this.maxHeight, height);
          }

          return {
            height: height - boxModelAdjust(this.list, 'height', 'content-box')
          };
        },
        write: function (ref) {
          var height = ref.height;
          height > 0 && css(this.list, 'minHeight', height);
        },
        events: ['resize']
      }
    };
    var sortable = {
      mixins: [Class, Animate],
      props: {
        group: String,
        threshold: Number,
        clsItem: String,
        clsPlaceholder: String,
        clsDrag: String,
        clsDragState: String,
        clsBase: String,
        clsNoDrag: String,
        clsEmpty: String,
        clsCustom: String,
        handle: String
      },
      data: {
        group: false,
        threshold: 5,
        clsItem: 'uk-sortable-item',
        clsPlaceholder: 'uk-sortable-placeholder',
        clsDrag: 'uk-sortable-drag',
        clsDragState: 'uk-drag',
        clsBase: 'uk-sortable',
        clsNoDrag: 'uk-sortable-nodrag',
        clsEmpty: 'uk-sortable-empty',
        clsCustom: '',
        handle: false,
        pos: {}
      },
      created: function () {
        var this$1$1 = this;
        ['init', 'start', 'move', 'end'].forEach(function (key) {
          var fn = this$1$1[key];

          this$1$1[key] = function (e) {
            assign(this$1$1.pos, getEventPos(e));
            fn(e);
          };
        });
      },
      events: {
        name: pointerDown,
        passive: false,
        handler: 'init'
      },
      computed: {
        target: function () {
          return (this.$el.tBodies || [this.$el])[0];
        },
        items: function () {
          return children(this.target);
        },
        isEmpty: {
          get: function () {
            return isEmpty(this.items);
          },
          watch: function (empty) {
            toggleClass(this.target, this.clsEmpty, empty);
          },
          immediate: true
        },
        handles: {
          get: function (ref, el) {
            var handle = ref.handle;
            return handle ? $$(handle, el) : this.items;
          },
          watch: function (handles, prev) {
            css(prev, {
              touchAction: '',
              userSelect: ''
            });
            css(handles, {
              touchAction: hasTouch ? 'none' : '',
              userSelect: 'none'
            }); // touchAction set to 'none' causes a performance drop in Chrome 80
          },
          immediate: true
        }
      },
      update: {
        write: function (data) {
          if (!this.drag || !parent(this.placeholder)) {
            return;
          }

          var ref = this;
          var ref_pos = ref.pos;
          var x = ref_pos.x;
          var y = ref_pos.y;
          var ref_origin = ref.origin;
          var offsetTop = ref_origin.offsetTop;
          var offsetLeft = ref_origin.offsetLeft;
          var placeholder = ref.placeholder;
          css(this.drag, {
            top: y - offsetTop,
            left: x - offsetLeft
          });
          var sortable = this.getSortable(document.elementFromPoint(x, y));

          if (!sortable) {
            return;
          }

          var items = sortable.items;

          if (items.some(Transition.inProgress)) {
            return;
          }

          var target = findTarget(items, {
            x: x,
            y: y
          });

          if (items.length && (!target || target === placeholder)) {
            return;
          }

          var previous = this.getSortable(placeholder);
          var insertTarget = findInsertTarget(sortable.target, target, placeholder, x, y, sortable === previous && data.moved !== target);

          if (insertTarget === false) {
            return;
          }

          if (insertTarget && placeholder === insertTarget) {
            return;
          }

          if (sortable !== previous) {
            previous.remove(placeholder);
            data.moved = target;
          } else {
            delete data.moved;
          }

          sortable.insert(placeholder, insertTarget);
          this.touched.add(sortable);
        },
        events: ['move']
      },
      methods: {
        init: function (e) {
          var target = e.target;
          var button = e.button;
          var defaultPrevented = e.defaultPrevented;
          var ref = this.items.filter(function (el) {
            return within(target, el);
          });
          var placeholder = ref[0];

          if (!placeholder || defaultPrevented || button > 0 || isInput(target) || within(target, "." + this.clsNoDrag) || this.handle && !within(target, this.handle)) {
            return;
          }

          e.preventDefault();
          this.touched = new Set([this]);
          this.placeholder = placeholder;
          this.origin = assign({
            target: target,
            index: index(placeholder)
          }, this.pos);
          on(document, pointerMove, this.move);
          on(document, pointerUp, this.end);

          if (!this.threshold) {
            this.start(e);
          }
        },
        start: function (e) {
          this.drag = appendDrag(this.$container, this.placeholder);
          var ref = this.placeholder.getBoundingClientRect();
          var left = ref.left;
          var top = ref.top;
          assign(this.origin, {
            offsetLeft: this.pos.x - left,
            offsetTop: this.pos.y - top
          });
          addClass(this.drag, this.clsDrag, this.clsCustom);
          addClass(this.placeholder, this.clsPlaceholder);
          addClass(this.items, this.clsItem);
          addClass(document.documentElement, this.clsDragState);
          trigger(this.$el, 'start', [this, this.placeholder]);
          trackScroll(this.pos);
          this.move(e);
        },
        move: function (e) {
          if (this.drag) {
            this.$emit('move');
          } else if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
            this.start(e);
          }
        },
        end: function () {
          var this$1$1 = this;
          off(document, pointerMove, this.move);
          off(document, pointerUp, this.end);
          off(window, 'scroll', this.scroll);

          if (!this.drag) {
            return;
          }

          untrackScroll();
          var sortable = this.getSortable(this.placeholder);

          if (this === sortable) {
            if (this.origin.index !== index(this.placeholder)) {
              trigger(this.$el, 'moved', [this, this.placeholder]);
            }
          } else {
            trigger(sortable.$el, 'added', [sortable, this.placeholder]);
            trigger(this.$el, 'removed', [this, this.placeholder]);
          }

          trigger(this.$el, 'stop', [this, this.placeholder]);
          remove$1(this.drag);
          this.drag = null;
          this.touched.forEach(function (ref) {
            var clsPlaceholder = ref.clsPlaceholder;
            var clsItem = ref.clsItem;
            return this$1$1.touched.forEach(function (sortable) {
              return removeClass(sortable.items, clsPlaceholder, clsItem);
            });
          });
          this.touched = null;
          removeClass(document.documentElement, this.clsDragState);
        },
        insert: function (element, target) {
          var this$1$1 = this;
          addClass(this.items, this.clsItem);

          var insert = function () {
            return target ? before(target, element) : append(this$1$1.target, element);
          };

          this.animate(insert);
        },
        remove: function (element) {
          if (!within(element, this.target)) {
            return;
          }

          this.animate(function () {
            return remove$1(element);
          });
        },
        getSortable: function (element) {
          do {
            var sortable = this.$getComponent(element, 'sortable');

            if (sortable && (sortable === this || this.group !== false && sortable.group === this.group)) {
              return sortable;
            }
          } while (element = parent(element));
        }
      }
    };
    var trackTimer;

    function trackScroll(pos) {
      var last = Date.now();
      trackTimer = setInterval(function () {
        var x = pos.x;
        var y = pos.y;
        y += window.pageYOffset;
        var dist = (Date.now() - last) * .3;
        last = Date.now();
        scrollParents(document.elementFromPoint(x, pos.y)).reverse().some(function (scrollEl) {
          var scroll = scrollEl.scrollTop;
          var scrollHeight = scrollEl.scrollHeight;
          var ref = offset(getViewport$1(scrollEl));
          var top = ref.top;
          var bottom = ref.bottom;
          var height = ref.height;

          if (top < y && top + 35 > y) {
            scroll -= dist;
          } else if (bottom > y && bottom - 35 < y) {
            scroll += dist;
          } else {
            return;
          }

          if (scroll > 0 && scroll < scrollHeight - height) {
            scrollTop(scrollEl, scroll);
            return true;
          }
        });
      }, 15);
    }

    function untrackScroll() {
      clearInterval(trackTimer);
    }

    function appendDrag(container, element) {
      var clone = append(container, element.outerHTML.replace(/(^<)(?:li|tr)|(?:li|tr)(\/>$)/g, '$1div$2'));
      css(clone, 'margin', '0', 'important');
      css(clone, assign({
        boxSizing: 'border-box',
        width: element.offsetWidth,
        height: element.offsetHeight
      }, css(element, ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])));
      height(clone.firstElementChild, height(element.firstElementChild));
      return clone;
    }

    function findTarget(items, point) {
      return items[findIndex(items, function (item) {
        return pointInRect(point, item.getBoundingClientRect());
      })];
    }

    function findInsertTarget(list, target, placeholder, x, y, sameList) {
      if (!children(list).length) {
        return;
      }

      var rect = target.getBoundingClientRect();

      if (!sameList) {
        if (!isHorizontal(list, placeholder)) {
          return y < rect.top + rect.height / 2 ? target : target.nextElementSibling;
        }

        return target;
      }

      var placeholderRect = placeholder.getBoundingClientRect();
      var sameRow = linesIntersect([rect.top, rect.bottom], [placeholderRect.top, placeholderRect.bottom]);
      var pointerPos = sameRow ? x : y;
      var lengthProp = sameRow ? 'width' : 'height';
      var startProp = sameRow ? 'left' : 'top';
      var endProp = sameRow ? 'right' : 'bottom';
      var diff = placeholderRect[lengthProp] < rect[lengthProp] ? rect[lengthProp] - placeholderRect[lengthProp] : 0;

      if (placeholderRect[startProp] < rect[startProp]) {
        if (diff && pointerPos < rect[startProp] + diff) {
          return false;
        }

        return target.nextElementSibling;
      }

      if (diff && pointerPos > rect[endProp] - diff) {
        return false;
      }

      return target;
    }

    function isHorizontal(list, placeholder) {
      var single = children(list).length === 1;

      if (single) {
        append(list, placeholder);
      }

      var items = children(list);
      var isHorizontal = items.some(function (el, i) {
        var rectA = el.getBoundingClientRect();
        return items.slice(i + 1).some(function (el) {
          var rectB = el.getBoundingClientRect();
          return !linesIntersect([rectA.left, rectA.right], [rectB.left, rectB.right]);
        });
      });

      if (single) {
        remove$1(placeholder);
      }

      return isHorizontal;
    }

    function linesIntersect(lineA, lineB) {
      return lineA[1] > lineB[0] && lineB[1] > lineA[0];
    }

    var obj;
    var tooltip = {
      mixins: [Container, Togglable, Position],
      args: 'title',
      props: {
        delay: Number,
        title: String
      },
      data: {
        pos: 'top',
        title: '',
        delay: 0,
        animation: ['uk-animation-scale-up'],
        duration: 100,
        cls: 'uk-active',
        clsPos: 'uk-tooltip'
      },
      beforeConnect: function () {
        this._hasTitle = hasAttr(this.$el, 'title');
        attr(this.$el, 'title', '');
        this.updateAria(false);
        makeFocusable(this.$el);
      },
      disconnected: function () {
        this.hide();
        attr(this.$el, 'title', this._hasTitle ? this.title : null);
      },
      methods: {
        show: function () {
          var this$1$1 = this;

          if (this.isToggled(this.tooltip || null) || !this.title) {
            return;
          }

          this._unbind = once(document, "show keydown " + pointerDown, this.hide, false, function (e) {
            return e.type === pointerDown && !within(e.target, this$1$1.$el) || e.type === 'keydown' && e.keyCode === 27 || e.type === 'show' && e.detail[0] !== this$1$1 && e.detail[0].$name === this$1$1.$name;
          });
          clearTimeout(this.showTimer);
          this.showTimer = setTimeout(this._show, this.delay);
        },
        hide: function () {
          var this$1$1 = this;

          if (matches(this.$el, 'input:focus')) {
            return;
          }

          clearTimeout(this.showTimer);

          if (!this.isToggled(this.tooltip || null)) {
            return;
          }

          this.toggleElement(this.tooltip, false, false).then(function () {
            this$1$1.tooltip = remove$1(this$1$1.tooltip);

            this$1$1._unbind();
          });
        },
        _show: function () {
          var this$1$1 = this;
          this.tooltip = append(this.container, "<div class=\"" + this.clsPos + "\"> <div class=\"" + this.clsPos + "-inner\">" + this.title + "</div> </div>");
          on(this.tooltip, 'toggled', function (e, toggled) {
            this$1$1.updateAria(toggled);

            if (!toggled) {
              return;
            }

            this$1$1.positionAt(this$1$1.tooltip, this$1$1.$el);
            this$1$1.origin = this$1$1.getAxis() === 'y' ? flipPosition(this$1$1.dir) + "-" + this$1$1.align : this$1$1.align + "-" + flipPosition(this$1$1.dir);
          });
          this.toggleElement(this.tooltip, true);
        },
        updateAria: function (toggled) {
          attr(this.$el, 'aria-expanded', toggled);
        }
      },
      events: (obj = {
        focus: 'show',
        blur: 'hide'
      }, obj[pointerEnter + " " + pointerLeave] = function (e) {
        if (!isTouch(e)) {
          this[e.type === pointerEnter ? 'show' : 'hide']();
        }
      }, obj[pointerDown] = function (e) {
        if (isTouch(e)) {
          this.show();
        }
      }, obj)
    };

    function makeFocusable(el) {
      if (!isFocusable(el)) {
        attr(el, 'tabindex', '0');
      }
    }

    var upload = {
      props: {
        allow: String,
        clsDragover: String,
        concurrent: Number,
        maxSize: Number,
        method: String,
        mime: String,
        msgInvalidMime: String,
        msgInvalidName: String,
        msgInvalidSize: String,
        multiple: Boolean,
        name: String,
        params: Object,
        type: String,
        url: String
      },
      data: {
        allow: false,
        clsDragover: 'uk-dragover',
        concurrent: 1,
        maxSize: 0,
        method: 'POST',
        mime: false,
        msgInvalidMime: 'Invalid File Type: %s',
        msgInvalidName: 'Invalid File Name: %s',
        msgInvalidSize: 'Invalid File Size: %s Kilobytes Max',
        multiple: false,
        name: 'files[]',
        params: {},
        type: '',
        url: '',
        abort: noop,
        beforeAll: noop,
        beforeSend: noop,
        complete: noop,
        completeAll: noop,
        error: noop,
        fail: noop,
        load: noop,
        loadEnd: noop,
        loadStart: noop,
        progress: noop
      },
      events: {
        change: function (e) {
          if (!matches(e.target, 'input[type="file"]')) {
            return;
          }

          e.preventDefault();

          if (e.target.files) {
            this.upload(e.target.files);
          }

          e.target.value = '';
        },
        drop: function (e) {
          stop(e);
          var transfer = e.dataTransfer;

          if (!transfer || !transfer.files) {
            return;
          }

          removeClass(this.$el, this.clsDragover);
          this.upload(transfer.files);
        },
        dragenter: function (e) {
          stop(e);
        },
        dragover: function (e) {
          stop(e);
          addClass(this.$el, this.clsDragover);
        },
        dragleave: function (e) {
          stop(e);
          removeClass(this.$el, this.clsDragover);
        }
      },
      methods: {
        upload: function (files) {
          var this$1$1 = this;

          if (!files.length) {
            return;
          }

          trigger(this.$el, 'upload', [files]);

          for (var i = 0; i < files.length; i++) {
            if (this.maxSize && this.maxSize * 1000 < files[i].size) {
              this.fail(this.msgInvalidSize.replace('%s', this.maxSize));
              return;
            }

            if (this.allow && !match(this.allow, files[i].name)) {
              this.fail(this.msgInvalidName.replace('%s', this.allow));
              return;
            }

            if (this.mime && !match(this.mime, files[i].type)) {
              this.fail(this.msgInvalidMime.replace('%s', this.mime));
              return;
            }
          }

          if (!this.multiple) {
            files = [files[0]];
          }

          this.beforeAll(this, files);
          var chunks = chunk(files, this.concurrent);

          var upload = function (files) {
            var data = new FormData();
            files.forEach(function (file) {
              return data.append(this$1$1.name, file);
            });

            for (var key in this$1$1.params) {
              data.append(key, this$1$1.params[key]);
            }

            ajax(this$1$1.url, {
              data: data,
              method: this$1$1.method,
              responseType: this$1$1.type,
              beforeSend: function (env) {
                var xhr = env.xhr;
                xhr.upload && on(xhr.upload, 'progress', this$1$1.progress);
                ['loadStart', 'load', 'loadEnd', 'abort'].forEach(function (type) {
                  return on(xhr, type.toLowerCase(), this$1$1[type]);
                });
                return this$1$1.beforeSend(env);
              }
            }).then(function (xhr) {
              this$1$1.complete(xhr);

              if (chunks.length) {
                upload(chunks.shift());
              } else {
                this$1$1.completeAll(xhr);
              }
            }, function (e) {
              return this$1$1.error(e);
            });
          };

          upload(chunks.shift());
        }
      }
    };

    function match(pattern, path) {
      return path.match(new RegExp("^" + pattern.replace(/\//g, '\\/').replace(/\*\*/g, '(\\/[^\\/]+)*').replace(/\*/g, '[^\\/]+').replace(/((?!\\))\?/g, '$1.') + "$", 'i'));
    }

    function chunk(files, size) {
      var chunks = [];

      for (var i = 0; i < files.length; i += size) {
        var chunk = [];

        for (var j = 0; j < size; j++) {
          chunk.push(files[i + j]);
        }

        chunks.push(chunk);
      }

      return chunks;
    }

    function stop(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    var components = /*#__PURE__*/Object.freeze({
      __proto__: null,
      Countdown: countdown,
      Filter: filter,
      Lightbox: lightbox,
      LightboxPanel: LightboxPanel,
      Notification: notification,
      Parallax: parallax,
      Slider: slider,
      SliderParallax: sliderParallax,
      Slideshow: slideshow,
      SlideshowParallax: sliderParallax,
      Sortable: sortable,
      Tooltip: tooltip,
      Upload: upload
    });
    each(components, function (component, name) {
      return UIkit.component(name, component);
    });
    return UIkit;
  });

  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Popper = Popper$2;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;
  exports.Util = Util;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=child-theme.js.map
