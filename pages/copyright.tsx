import React from 'react';
import LinkButton from '../components/generic/LinkButton';
import LandingPage from '../components/LandingPage';

function Copyright() {

  return (
    <LandingPage heading="Copyright | Faith Dashboard">
      <p>Scripture quotations marked “ESV” are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. You may not copy or download more than 500 consecutive verses of the ESV Bible or more than one half of any book of the ESV Bible.</p>

      <p>Photo backgrounds provided by <a href="https://unsplash.com/">Unsplash</a>.</p>

      <p><LinkButton href="/">Return to App</LinkButton></p>
    </LandingPage>
  );

}

export async function getStaticProps() {
  return {
    props: {
      pagePath: '/copyright',
      pageTitle: 'Copyright | Faith Dashboard',
      pageDescription: 'Copyright information for Faith Dashboard, your one place for anything and everything that inspires your faith.'
    }
  };
}

export default Copyright;
