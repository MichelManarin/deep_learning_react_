import { SetStorageMock } from '@/data/test'
import { LocalSaveAccessToken } from './local-save-access-token'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageSpy: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageMock()
  const sut = new LocalSaveAccessToken(setStorageSpy)
  return {
    sut,
    setStorageSpy
  }
}

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', () => {
    const { sut, setStorageSpy } = makeSut()
    const fakeAccount = mockAccountModel()
    sut.save(fakeAccount)
    expect(setStorageSpy.key).toBe('account')
    expect(setStorageSpy.value).toBe(fakeAccount)
  })

  test('Should throw error if SetStorage throws', () => {
    const { sut, setStorageSpy } = makeSut()
    const errorMessage = 'Error saving to storage'
    jest.spyOn(setStorageSpy, 'set').mockImplementationOnce(() => { throw new Error(errorMessage) })
    const testFunction = (): void => sut.save(mockAccountModel())
    expect(testFunction).toThrow(errorMessage)
  })
})
