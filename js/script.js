{
  'use strict';

  const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles';

  const generateTitleLinks = function generateTitleLinks(customSelector = ''){

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';

    for(let article of articles){

      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;

      /* get the title from the title element */
      /* create HTML of the link */
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      /* insert link into html variable */
      html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');
    for(let link of links){
      link.addEventListener('click', titleClickHandler);
    }
  };

  const optArticleTagsSelector = '.post-tags .list';

  generateTitleLinks();

  const generateTags = function generateTags(){
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
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
        const tagHTML = '<li><a href="#tag-' + tag + '">' + tag +'</a></li>';
        /* add generated code to html variable */
        html = html + tagHTML;
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      titleList.innerHTML = html;
      /* END LOOP: for every article: */

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
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
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
    const links = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for(let link of links){
    /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  const optArticleAuthorSelector = '.post-author';

  const generateAuthors = function generateAuthors() {
    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles) {
      console.log(article);
      const authorWrapper = article.querySelector(optArticleAuthorSelector);
      console.log(authorWrapper);
      let html = '';
      const author = article.getAttribute('data-author');
      console.log(author);
      const authorHTML = 'by <a href="#author-' + author +'">' + author + '</a>';
      html = html + authorHTML;
      authorWrapper.innerHTML = html;
    }

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
    const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
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
    const links = document.querySelectorAll('a[href^="#author-"]');
    /* START LOOP: for each link */
    for(let link of links){
    /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToAuthors();
}
