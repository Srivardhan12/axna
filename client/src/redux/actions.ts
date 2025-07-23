export const SIGNUP = (payload: object) => {
    console.log(payload)
    return { type: "SIGNUP" }
}

export const SIGNIN = () => {
    return { type: "SIGNIN" }
}