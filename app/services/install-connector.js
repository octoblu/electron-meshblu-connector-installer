import Execute from './execute'

class InstallConnector {
  constructor({ emitDebug, config }) {
    this.emitDebug = emitDebug
    this.config = config
    this.execute = new Execute({ emitDebug, serviceType: config.serviceType })
  }

  getServiceType(serviceType) {
    this.emitDebug(`getServiceType ${serviceType}`)
    if (serviceType === 'service') return 'Service'
    if (serviceType === 'user-service') return 'UserService'
    if (serviceType === 'user-login') return 'UserLogin'
  }

  install(callback) {
    const {
      otpKey,
      binPath,
      connector,
    } = this.config
    const { installer } = this.config.coreDependencies
    const executable = installer.filePath
    const serviceType = this.getServiceType(this.config.serviceType)
    this.emitDebug(`install ${serviceType}`)

    const args = [
      '--one-time-password',
      otpKey,
      '--service-type',
      serviceType,
    ]
    this.emitDebug(`Installing connector ${connector}`)
    process.nextTick(() => {
      this.execute.do({ executable, args, cwd: binPath }, (error) => {
        if (error) this.emitDebug(`Connector install error: ${error.message}`, true)
        if (error) return callback(new Error('Connector Install Failure'))
        callback()
      })
    })
  }
}

export default InstallConnector
