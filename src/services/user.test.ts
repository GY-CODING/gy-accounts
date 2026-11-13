import { getUser, updateApiKey, updateUser } from './user';
import type { UserProfile } from '@gycoding/nebula';

const response = (body: unknown, ok = true) => ({ ok, json: async () => body });
const profile = { username: 'ana' } as UserProfile;

describe('user service', () => {
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it('gets the profile', async () => {
    global.fetch = jest.fn().mockResolvedValue(response(profile));
    await expect(getUser()).resolves.toEqual(profile);
  });

  it('updates the profile and returns its GYCODING data', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(response({ gyCodingData: profile }));
    await expect(updateUser(profile)).resolves.toEqual(profile);
    expect((global.fetch as jest.Mock).mock.calls[0][1]).toMatchObject({
      method: 'PUT',
    });
  });

  it('refreshes the API key', async () => {
    global.fetch = jest.fn().mockResolvedValue(response({ success: true }));
    await expect(updateApiKey()).resolves.toEqual({ success: true });
  });

  it.each([
    ['getUser', () => getUser(), 'Failed to fetch user data'],
    ['updateUser', () => updateUser(profile), 'Failed to update user data'],
    ['updateApiKey', () => updateApiKey(), 'Failed to update API KEY'],
  ])('%s logs and rethrows failures', async (_name, call, message) => {
    global.fetch = jest.fn().mockResolvedValue(response(null, false));
    await expect(call()).rejects.toThrow(message);
    expect(console.error).toHaveBeenCalled();
  });
});
