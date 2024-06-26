/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')
// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
//let errorMock: jest.SpiedFunction<typeof core.error>
//let getInputMock: jest.SpiedFunction<typeof core.getInput>
//let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
//let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    //errorMock = jest.spyOn(core, 'error').mockImplementation()
    //getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    //setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    //setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('log a nice comment', async () => {
    // Set the action's inputs as return values from core.getInput()
    /*getInputMock.mockImplementation(name => {
      switch (name) {
        case 'testParameter':
          return 'Hello'
        default:
          return ''
      }
    })*/

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Hello from powerful comment!')
    /*expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'time',
      expect.stringMatching(timeRegex)
    )*/
    //expect(errorMock).not.toHaveBeenCalled()
  })

  it('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    /*getInputMock.mockImplementation(name => {
      switch (name) {
        case 'testParameter':
          return 'Bad'
        default:
          return ''
      }
    })*/

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    //expect(setFailedMock).toHaveBeenNthCalledWith(1, 'Bad parameter')
    //expect(errorMock).not.toHaveBeenCalled()
  })
})
