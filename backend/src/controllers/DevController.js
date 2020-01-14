const axios = require("axios")
const Dev = require("../models/Dev")
const parseStringAsArray = require("../utils/parseStringAsArray")

module.exports = {
  async index(request, response) {
    const devs = await Dev.find()
    return response.json(devs)
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const responseGithub = await axios.get(
        `https://api.github.com/users/${github_username}`
      )

      const { name = login, avatar_url, bio } = responseGithub.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      })
    }

    return response.json(dev)
  },

  async update(request, response) {
    const id = request.params.id
    const { name, avatar_url, techs } = request.body

    const techsArray = parseStringAsArray(techs)

    const dev = await Dev.updateOne(
      { _id: id },
      {
        $set: {
          name,
          avatar_url,
          techs: techsArray
        }
      },
      (err, result) => {
        if (err) return response.json({ message: "Erro" })
        return response.json({ message: "Sucesso" })
      }
    )
  },

  async destroy(request, response) {
    const id = request.params.id

    const dev = await Dev.deleteOne({ _id: id }, (err, result) => {
      if (err || !result.deletedCount) return response.json({ message: "Erro" })
      return response.json({ message: "Sucesso" })
    })
  }
}
