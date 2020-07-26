import { validateYoutubeLink } from './FormWrapper';

describe('Form tests', () => {
    // fix
    it('should return youtube-id if valid youtube-link', () => {
        expect(validateYoutubeLink('https://www.youtube.com/watch?v=XAQxSJhMK5E')).toBe('XAQxSJhMK5E');
        expect(validateYoutubeLink('https://www.youtube.com/watch?v=3PjdxjWK0F0&t=124s')).toBe('3PjdxjWK0F0');
        expect(validateYoutubeLink('https://youtube.com/watch?v=3PjdxjWK0F0&t=124s')).toBe('3PjdxjWK0F0');
        expect(validateYoutubeLink('https://youtu.be/3PjdxjWK0F0')).toBe('3PjdxjWK0F0');
    });

    it('should return false if not valid youtube-link', () => {
        expect(validateYoutubeLink('https://www.youtub.com/watch?v=3PjdxjWK0F0&t=124s')).toBe(false);
        expect(validateYoutubeLink('https://stackoverflow.com')).toBe(false);
        expect(validateYoutubeLink('https://www.yout.be/watch?v=3PjdxjWK0F0&t=124s')).toBe(false);
    })
})