{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  };

  const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
    titleSelector: '.post-title',
    CloudClassCount: 5,
  };

  const select = {
    all: {
      articles: '.post',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
        active: {
          authors: 'a.active[href^="#author-"]',
          tags: 'a.active[href^="#tag-"]',
        },
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags .list',
      authors: '.authors .list',
    },
    active: {
      titles: '.titles a.active',
      posts: '.posts article.active',
    },
  };


  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(select.active.titles);
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll(select.active.posts);
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleHrefSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleHrefSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const generateTitleLinks = function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(select.all.articles + customSelector);
    let html = '';

    for(let article of articles){

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

      /* get the title from the title element */
      /* create HTML of the link */
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);

      /* insert link into html variable */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const calculateTagsParams = function calculateTagsParams(tags){
    const params = {'max' : 0, 'min' : 99999};

    for(let tag in tags){
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }
    return params;
  };

  const calculateTagClass = function(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (opts.tagSizes.count - 1) + 1 );
    return opts.tagSizes.classPrefix + classNumber;
  };

  const generateTags = function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const titleList = article.querySelector('ul');
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray){
      /* generate HTML of the link */
        const linkHTMLData = {id: tag, title: tag};
        const linkHTML = templates.tagLink(linkHTMLData);
        /* add generated code to html variable */
        html = html + linkHTML;

        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]){
        /* [NEW] add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
        /* insert HTML of all the links into the tags wrapper */
        titleList.innerHTML = html;
        /* END LOOP: for every article: */
      }
      /* [NEW] find list of tags in right column */
      const tagList = document.querySelector('.tags');

      /* [NEW] create variable for all links HTML code */
      const tagsParams = calculateTagsParams(allTags);

      const allTagsData = {tags: []};
      /* [NEW] START LOOP: for each tag in allTags: */
      for(let tag in allTags){
        /* [NEW] generate code of a link and add it to allTagsHTML */
        allTagsData.tags.push({
          tag: tag,
          count: allTags[tag],
          className: calculateTagClass(allTags[tag], tagsParams)
        });
      }
      /* [NEW] END LOOP: for each tag in allTags: */

      /*[NEW] add HTML from allTagsHTML to tagList */
      tagList.innerHTML = templates.tagCloudLink(allTagsData);
    }
  };

  generateTags();

  const tagClickHandler = function(event){
    /* prevent default action for this event */
    event.preventDefault;
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTags = document.querySelectorAll(select.all.linksTo.active.tags);
    /* START LOOP: for each active tag link */
    for (const activeTag of activeTags) {
    /* remove class active */
      activeTag.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (const tagLink of tagLinks) {
      /* add class active */
      tagLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function addClickListenersToTags(){
    /* find all links to tags */
    const links = document.querySelectorAll(select.all.linksTo.tags);
    /* START LOOP: for each link */
    for(let link of links){
    /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  const generateAuthors = function generateAuthors() {
    const articles = document.querySelectorAll(select.all.articles);
    for (let article of articles) {
      const authorWrapper = article.querySelector(select.article.author);
      let html = '';
      const author = article.getAttribute('data-author');
      const linkHTMLData = {id: author, title: author};
      const authorHTML = templates.authorLink(linkHTMLData);
      html = html + authorHTML;
      authorWrapper.innerHTML = html;
    }
    let allAuthors = {};
    for (const article of articles) {
      const author = article.getAttribute('data-author');
      if(!allAuthors[author]){
        /* [NEW] add generated code to allTags array */
        allAuthors[author] = 1;
        console.log(allAuthors[author]);
      } else {
        allAuthors[author]++;
        console.log(allAuthors[author]);
      }
    }
    const authorList = document.querySelector('.authors');
    console.log(authorList);
    const authParameters = calculateTagsParams(allAuthors);
    console.log(authParameters);
    let allAuthorsHTML = '';

    for(let author in allAuthors){
      /* [NEW] generate code of a link and add it to allTagsHTML */
      allAuthorsHTML += '<li><a class="" href="#author-' + author + '">' + author + '&nbsp;' +  allAuthors[author] +'</a>&nbsp;&nbsp;<span id="'+ allAuthors[author] + '"></span></li>';
    }
    authorList.innerHTML = allAuthorsHTML;

  };

  generateAuthors();

  const authorClickHandler = function(event){

    /* prevent default action for this event */
    event.preventDefault;
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all tag links with class active */
    const activeAuthors = document.querySelectorAll(select.all.linksTo.active.authors);
    /* START LOOP: for each active tag link */
    for (let activeAuthor of activeAuthors) {
    /* remove class active */
      activeAuthor.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let authorLink of authorLinks) {
      /* add class active */
      authorLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function addClickListenersToAuthors(){
    /* find all links to tags */
    const links = document.querySelectorAll(select.all.linksTo.authors);
    /* START LOOP: for each link */
    for(let link of links){
    /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToAuthors();

}
