/* Blogger theme custom JavaScript
 * Repository: crazysuman99/blogger-theme
 * Third-party/Blogger dynamic scripts remain in theme.xml intentionally.
 */
(function (window, document) {
  'use strict';

  // Listing-page snippet helpers (kept global for Blogger template compatibility).
  window.snippet_count = 140;
  window.removeHtmlTag = function (html, limit) {
    if (html.indexOf('<') !== -1) {
      var parts = html.split('<');
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].indexOf('>') !== -1) parts[i] = parts[i].substring(parts[i].indexOf('>') + 1);
      }
      html = parts.join('');
    }
    limit = limit < html.length - 1 ? limit : html.length - 2;
    while (html.charAt(limit - 1) !== ' ' && html.indexOf(' ', limit) !== -1) limit++;
    return html.substring(0, limit - 1) + '...';
  };
  window.createSnippet = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '<div class="snippets">' + window.removeHtmlTag(el.innerHTML, window.snippet_count) + '</div>';
  };
  window.twistedthumbnail = function (url, title) {
    var width = 310, height = 230;
    if (!url) return '';
    var safeTitle = (title || '').replace(/"/g, '');
    var imageUrl = url.replace(/\/s[0-9]+(-c)?\//, '/w' + width + '-h' + height + '-c/');
    return '<img width="' + width + '" height="' + height + '" src="' + imageUrl + '" alt="' + safeTitle + '" title="' + safeTitle + '"/>';
  };

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  // Convert underscore-prefixed menu labels into nested lists.
  function buildHybridMenu() {
    var root = document.getElementById('main-menu-nav');
    if (!root || root.getAttribute('data-hybrid-ready') === '1') return;
    root.setAttribute('data-hybrid-ready', '1');
    var items = Array.prototype.slice.call(root.children);
    var depths = items.map(function (li) {
      var a = li.querySelector('a');
      var label = a ? a.textContent : '';
      var match = label.match(/^_+/);
      var depth = match ? match[0].length : 0;
      if (a && depth) a.textContent = label.substring(depth);
      return depth;
    });
    var stack = [{ depth: -1, list: root }];
    items.forEach(function (li, index) {
      var depth = depths[index];
      while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
      stack[stack.length - 1].list.appendChild(li);
      if (depths[index + 1] > depth) {
        var sub = document.createElement('ul');
        li.appendChild(sub);
        stack.push({ depth: depth, list: sub });
      }
    });
  }

  // Fetch and append the remaining pages for the all-posts listing.
  function loadAllPosts() {
    var container = document.querySelector('.blog-posts.all-posts-one-page');
    if (!container) return;
    var pager = document.querySelector('#blog-pager-older-link a');
    var nextUrl = pager ? pager.href : '';
    function getNext(url) {
      if (!url) return;
      fetch(url, { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('Could not load next page');
          return response.text();
        })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var posts = doc.querySelectorAll('.blog-posts.all-posts-one-page > .post-outer');
          posts.forEach(function (post) { container.appendChild(post.cloneNode(true)); });
          var next = doc.querySelector('#blog-pager-older-link a');
          getNext(next ? next.href : '');
        })
        .catch(function (error) { if (window.console) console.log('All-post loader stopped:', error); });
    }
    getNext(nextUrl);
  }

  ready(function () {
    buildHybridMenu();
    loadAllPosts();

    // jQuery-dependent theme interactions. jQuery is loaded before this file in theme.xml.
    if (window.jQuery) {
      var $ = window.jQuery;
      // Pager title previews and back-to-top behavior.
      if ($.fn && $.fn.load) {
        var older = $('a.blog-pager-older-link').attr('href');
        if (older) $('a.blog-pager-older-link').load(older + ' .post-title:first', function () {
          var text = $(this).text(); $(this).text(text);
        });
        var newer = $('a.blog-pager-newer-link').attr('href');
        if (newer) $('a.blog-pager-newer-link').load(newer + ' .post-title:first', function () {
          var text = $(this).text(); $(this).text(text);
        });
      }
      $(window).on('scroll.bloggerTheme', function () {
        $('#back-to-simple').toggleClass('show', $(window).scrollTop() > 200);
      });
      $('#back-to-simple').on('click.bloggerTheme', function () {
        $('html,body').animate({ scrollTop: 0 });
      });

      // Sticky navigation placeholder element preserves the original behavior.
      var nav = document.getElementById('nav');
      if (nav && nav.parentNode && !nav.previousElementSibling?.classList.contains('blogger-theme-sticky-spacer')) {
        var spacer = document.createElement('div');
        spacer.className = 'blogger-theme-sticky-spacer';
        nav.parentNode.insertBefore(spacer, nav);
        var navWidth = nav.offsetWidth;
        var navClass = nav.className + ' makesticky';
        function stickyCheck() {
          if (nav.getBoundingClientRect().top < 0) {
            nav.className = navClass + ' makesticking'; nav.style.width = navWidth + 'px';
          } else nav.className = navClass;
        }
        window.addEventListener('scroll', stickyCheck, false);
      }

      // Top navigation active state and mobile dropdown.
      var currentUrl = window.location.href.toLowerCase();
      $('.top-gridnav ul li a').each(function () {
        if (currentUrl.indexOf(this.href.toLowerCase()) > -1) {
          $('li.highlight').removeClass('highlight'); $(this).parent().addClass('highlight');
        }
      });
      var pull = $('#pull'), menu = $('.top-gridnav ul');
      pull.off('click.bloggerTheme').on('click.bloggerTheme', function (event) {
        event.preventDefault(); menu.slideToggle();
      });
      $(window).off('resize.bloggerThemeMenu').on('resize.bloggerThemeMenu', function () {
        if ($(window).width() > 320 && menu.is(':hidden')) menu.removeAttr('style');
      });

      // Main responsive navigation.
      var width = document.body.clientWidth;
      $('.shnav li a').each(function () { if ($(this).next().length) $(this).addClass('parent'); });
      $('.menu-trigger').off('click.bloggerTheme').on('click.bloggerTheme', function (event) {
        event.preventDefault(); $(this).toggleClass('active'); $('.shnav').toggle();
      });
      function adjustMenu() {
        width = document.body.clientWidth;
        if (width < 768) {
          $('.menu-trigger').css('display', 'inline-block');
          if (!$('.menu-trigger').hasClass('active')) $('.shnav').hide(); else $('.shnav').show();
          $('.shnav li').off('mouseenter.bloggerTheme mouseleave.bloggerTheme');
          $('.shnav li a.parent').off('click.bloggerTheme').on('click.bloggerTheme', function (event) {
            event.preventDefault(); $(this).parent('li').toggleClass('hover');
          });
        } else {
          $('.menu-trigger').css('display', 'none'); $('.shnav').show(); $('.shnav li').removeClass('hover');
          $('.shnav li a').off('click.bloggerTheme');
          $('.shnav li').off('mouseenter.bloggerTheme mouseleave.bloggerTheme')
            .on('mouseenter.bloggerTheme mouseleave.bloggerTheme', function () { $(this).toggleClass('hover'); });
        }
      }
      adjustMenu();
      $(window).off('resize.bloggerTheme orientationchange.bloggerTheme')
        .on('resize.bloggerTheme orientationchange.bloggerTheme', adjustMenu);

      // Popular-post snippet and thumbnail sizing.
      $('.popular-posts ul li .item-snippet').each(function () {
        var value = $(this).text().substr(0, 60), last = value.lastIndexOf(' ');
        if (last > 42) $(this).text(value.substr(0, last).replace(/[?,!\.-:;]*$/, '...'));
      });
      $(function () {
        var width = 80, height = 60;
        $('#PopularPosts1').find('img').each(function () {
          var img = $(this);
          img.attr({ src: img.attr('src').replace('/s72-c/', '/w' + width + '-h' + height + '-c/'), width: width, height: height });
        });
        $('.popular-posts ul li .item-snippet').each(function () {
          var value = $(this).text().substr(0, 30), last = value.lastIndexOf(' ');
          if (last > 10) $(this).text(value.substr(0, last).replace(/[?,!\.-:;]*$/, ' ...'));
        });
      });
    }

    // Tawk.to chat loader.
    if (!window.Tawk_API) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      var firstScript = document.getElementsByTagName('script')[0];
      var chat = document.createElement('script');
      chat.async = true;
      chat.src = 'https://embed.tawk.to/6af54134e84c933e6cc13081/1k770de4p';
      chat.charset = 'UTF-8'; chat.setAttribute('crossorigin', '*');
      if (firstScript && firstScript.parentNode) firstScript.parentNode.insertBefore(chat, firstScript);
    }
  });
})(window, document);
