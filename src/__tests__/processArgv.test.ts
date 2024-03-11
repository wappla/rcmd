import { cosmiconfig } from 'cosmiconfig'
import { processArgv } from '../processArgv'

jest.mock('cosmiconfig', () => ({
    cosmiconfig: jest.fn().mockReturnValue({
        search: jest.fn().mockResolvedValue(null),
        ...jest.requireActual('cosmiconfig'),
    }),
}))

const mockedCosmiconfig = jest.mocked(cosmiconfig)

describe('processArgv', () => {
    test('handles no config file', () => {
        expect(async () => await processArgv([])).rejects.toThrow(
            'No rcmd config found'
        )
    })
    test('handles no env option', () => {
        mockedCosmiconfig.mockReturnValue({
            ...jest.requireActual('cosmiconfig'),
            search: jest.fn().mockResolvedValue({
                config: { envs: {}, basePath: '' },
            }),
        })
        expect(async () => await processArgv([])).rejects.toThrow(
            'No env option specified'
        )
    })
})
