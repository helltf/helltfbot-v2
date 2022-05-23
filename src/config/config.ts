class IdentityOptions {
  username: string
  password: string

  constructor(password: string, username: string) {
    this.password = 'oauth:' + password
    this.username = username
  }
}

export { IdentityOptions }
