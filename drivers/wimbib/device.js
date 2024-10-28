'use strict';

const Homey = require('homey');

module.exports = class WimbibDevice extends Homey.Device {

  /**
   * onInit is called when the device is initialized.
   */
  async onInit() {
    this.log('WimbibDevice has been initialized');
    
    const settings = this.getSettings();
    this.log('wimbib address:', settings.wimbib_address);

    await this.update();

    this.pollTimeout = this.homey.setInterval(async () => {
      await this.update();
    }, 10000);
  }

  async update() {
    this.log('updating WimbibDevice');


  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('WimbibDevice has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('WimbibDevice settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name) {
    this.log('WimbibDevice was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('WimbibDevice has been deleted');
    this.homey.clearInterval(this.pollTimeout);
  }


  async onDiscoveryAddressChanged(address) {
    this.log('WimbibDevice discovery address changed to:', address);
  }

};
