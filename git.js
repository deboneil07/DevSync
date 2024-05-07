// Instead of:
// const { Octokit } = require('@octokit/core');
// Use dynamic import():
import('dotenv').then(dotenv => {
  dotenv.config();
})
import('@octokit/core').then(({ Octokit }) => {
  // Create a new Octokit instance
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  // Define the owner (username) and the repository name to search for
  const owner = 'deboneil07'; // Replace 'username' with the actual GitHub username
  const repoName = owner ; // Replace 'repository-name' with the name of the repository you want to search for

  // Search for the repository and fetch its code
  async function searchAndFetchCode() {
      try {
          // Make a request to search repositories
          const response = await octokit.request('GET /search/repositories', {
              q: `user:${owner} repo: ${repoName}`, // Search query to find the repository belonging to the specific user
              per_page: 1 // Limit the search results to 1 repository
          });

          // Check if any repositories were found
          if (response.data.items.length > 0) {
              const repo = response.data.items[0];
              console.log('Repository found:', repo.full_name);
              console.log('Description:', repo.description);
              console.log('URL:', repo.html_url);

              // Fetch the contents of the root directory of the repository
              const contentsResponse = await octokit.request('GET /repos/{owner}/{repo}/readme', {
                  owner: owner,
                  repo: repoName
              });

              // Log the contents of the root directory
              const code = Buffer.from(contentsResponse.data.content, 'base64').toString('utf-8');
              console.log(code);
          } else {
              console.log('Repository not found');
          }
      } catch (error) {
          console.error('Error:', error.message);
      }
  }

  // Call the searchAndFetchCode function
  searchAndFetchCode();
});
