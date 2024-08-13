import * as core from '@actions/core'
import * as github from '@actions/github'
/*eslint import/no-unresolved: [2, { ignore: ['@octokit/types'] }]*/
import { GetResponseTypeFromEndpointMethod } from '@octokit/types'

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
    const section = core.getInput('section')
    const body = core.getInput('body', { required: true })
    const octokit = github.getOctokit(githubToken)
    const pullRequestNumber = context.payload.pull_request?.number

    if (!pullRequestNumber) {
      throw new Error('Pull request number cannot be blank')
    }

    type CreateCommentResponseType = GetResponseTypeFromEndpointMethod<
      typeof octokit.rest.issues.createComment
    >
    type UpdateCommentResponseType = GetResponseTypeFromEndpointMethod<
      typeof octokit.rest.issues.updateComment
    >

    const updateComment = async (
      commentId: number,
      commentBody: string
    ): Promise<UpdateCommentResponseType> => {
      if (section.length === 0) {
        core.info(`Updating the content of the comment with ${commentBody}`)
        return octokit.rest.issues.updateComment({
          ...context.repo,
          comment_id: commentId,
          body: commentBody
        })
      } else {
        const commentSectionStart = `<!-- POWERFUL PR SECTION START: ${section} -->`
        const commentSectionEnd = `<!-- POWERFUL PR SECTION END: ${section} -->`
        const comment = await octokit.rest.issues.getComment({
          ...context.repo,
          comment_id: commentId
        })
        const containsSection =
          comment.data.body &&
          comment.data.body.includes(commentSectionStart) &&
          comment.data.body.includes(commentSectionEnd)
        if (containsSection && comment.data.body) {
          const bodyBeforeSection = comment.data.body.substring(
            0,
            comment.data.body.indexOf(commentSectionStart) +
              commentSectionStart.length
          )
          const bodyAfterSection = comment.data.body.substring(
            comment.data.body.indexOf(commentSectionEnd)
          )
          core.info(
            `Updating the content of the comment with ${bodyBeforeSection}\n${body}${bodyAfterSection}`
          )
          return octokit.rest.issues.updateComment({
            ...context.repo,
            comment_id: commentId,
            body: `${bodyBeforeSection}\n${body}\n${bodyAfterSection}`
          })
        } else {
          throw new Error('Section new found :(')
        }
      }
    }

    const createComment = async (
      commentBody: string
    ): Promise<CreateCommentResponseType> =>
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
      const existingStickyComment = comments.data.find(comment => {
        return comment.body && comment.body.startsWith(stickyCommentHeader)
      })
      if (existingStickyComment) {
        core.info(`A sticky comment exists: ${existingStickyComment.body}`)
        await updateComment(
          existingStickyComment.id,
          `${stickyCommentHeader}\n${body}`
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
