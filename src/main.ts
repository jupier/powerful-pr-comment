import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/rest'
import { connected } from 'process'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Hello from powerful comment!`)
    const context = github.context
    const pullRequestNumber = context.payload.pull_request?.number

    if (!pullRequestNumber) {
      throw new Error('Pull request number cannot be blank')
    }

    const octokit = new Octokit()
    octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pullRequestNumber,
      body: 'Hello there'
    })

    const param: string = core.getInput('testParameter')
    if (param !== 'Hello') throw new Error('Bad parameter')

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
