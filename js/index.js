const copyButton = document.querySelector('#copy-phone');
const phoneLink = document.querySelector('#academy-phone');
const copyStatus = document.querySelector('#copy-phone-status');

if (copyButton && phoneLink && copyStatus) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(phoneLink.textContent.trim());
      copyStatus.textContent = 'Phone number copied.';
    } catch (error) {
      copyStatus.textContent = 'Copy is not available in this browser. Select the phone number to copy it.';
    }
  });
}
