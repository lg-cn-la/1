const endpoint = 'https://api.indexnow.org/IndexNow';

const payload = {
  host: 'getsampora.com',
  key: '65e62f1d55ca4d9fbd11e31ca240a016',
  keyLocation: 'https://getsampora.com/65e62f1d55ca4d9fbd11e31ca240a016.txt',
  urlList: [
    'https://getsampora.com/',
    'https://getsampora.com/solutions.html',
    'https://getsampora.com/plans.html',
    'https://getsampora.com/resources.html',
    'https://getsampora.com/resource-manuals.html',
    'https://getsampora.com/contact.html',
    'https://getsampora.com/about.html',
    'https://getsampora.com/privacy.html',
    'https://getsampora.com/cookie-policy.html',
    'https://getsampora.com/terms.html',
  ],
};

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();

  console.log(`Submitted URL count: ${payload.urlList.length}`);
  console.log(`HTTP status: ${response.status}`);
  console.log('Response body:');
  console.log(body || '(empty)');

  if (response.status !== 200) {
    console.error(`IndexNow submission failed with HTTP status ${response.status}.`);
    process.exit(1);
  }
} catch (error) {
  console.log(`Submitted URL count: ${payload.urlList.length}`);
  console.error('IndexNow submission failed before receiving an HTTP response.');
  console.error(error);
  process.exit(1);
}
