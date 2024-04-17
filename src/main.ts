import * as core from '@actions/core'
import * as github from '@actions/github'
import { consumers } from 'stream'

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
    const commentIdToUpdate = core.getInput('commentId')
    const isSticky = core.getBooleanInput('sticky')
    const body = core.getInput('body', { required: true })
    const octokit = github.getOctokit(githubToken)
    const pullRequestNumber = context.payload.pull_request?.number

    if (!pullRequestNumber) {
      throw new Error('Pull request number cannot be blank')
    }

    const updateComment = (commentId: number, commentBody: string) =>
      octokit.rest.issues.updateComment({
        ...context.repo,
        comment_id: commentId,
        body: commentBody
      })

    const createComment = (commentBody: string) =>
      octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pullRequestNumber,
        body: commentBody
      })

    if (isSticky) {
      const stickyCommentHeader = '<!-- POWERFUL PR STICKY COMMENT -->'
      const comments = await octokit.rest.issues.listComments({
        ...context.repo,
        issue_number: pullRequestNumber
      })
      comments.data.forEach(comment => {
        core.info(`${comment.body} ${comment.body_html} ${comment.body_text}`)
      })
      const existingStickyComment = comments.data.find(comment => {
        return comment.body && comment.body.startsWith(stickyCommentHeader)
      })
      if (existingStickyComment) {
        core.info(`A sticky comment exists: ${existingStickyComment.body}`)
        await updateComment(
          existingStickyComment.id,
          `${stickyCommentHeader}${body}`
        )
        core.setOutput('commentId', existingStickyComment.id)
      } else {
        core.info('Creating new sticky comment')
        const result = await createComment(`${stickyCommentHeader}${body}`)
        core.setOutput('commentId', result.data.id)
      }
    } else if (commentIdToUpdate.length > 0) {
      const result = await updateComment(parseInt(commentIdToUpdate), body)
      const commentId = result.data.id
      core.setOutput('commentId', commentId)
    } else {
      const result = await createComment(body)
      const commentId = result.data.id

      // Set outputs for other workflow steps to use
      core.setOutput('commentId', commentId)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
