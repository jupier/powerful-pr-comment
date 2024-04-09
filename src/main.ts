import * as core from '@actions/core'
import * as github from '@actions/github'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Hello from powerful comment!`)
    const context = github.context
    const githubToken = core.getInput('GITHUB_TOKEN', { required: true })
    const body = core.getInput('body', { required: true })
    const octokit = github.getOctokit(githubToken)
    const pullRequestNumber = context.payload.pull_request?.number

    if (!pullRequestNumber) {
      throw new Error('Pull request number cannot be blank')
    }

    const result = await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pullRequestNumber,
      body
    })

    const commentId = result.data.id

    // Set outputs for other workflow steps to use
    core.setOutput('commentId', commentId)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
