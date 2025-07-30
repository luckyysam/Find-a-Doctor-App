import mql from '@microlink/mql'

export const getProviderWebsiteScreenShot = async ( url: string ) => {
  if (!url) return
  const { status, data } = await mql(url, {
    screenshot: true
  })
  if (status) {
    return data
  }
}



