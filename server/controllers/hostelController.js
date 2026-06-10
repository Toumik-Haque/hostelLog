import User from "../models/User.js"
import ApprovedStudent from "../models/ApprovedStudent.js"

// Toggle IN / OUT
const toggleHostelStatus = async (req, res) => {
    try {

        const userId = req.user.id

        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        // Toggle status
        user.hostelStatus =
            user.hostelStatus === 'IN'
                ? 'OUT'
                : 'IN'

        user.lastStatusChange = new Date()

        await user.save()

        return res.json({
            message: 'Status updated successfully',
            hostelStatus: user.hostelStatus,
            lastStatusChange: user.lastStatusChange
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getHostelStats = async (req, res) => {
  try {

    const users = await User.find()
    const approved = await ApprovedStudent.find()

    // -------------------------
    // FILTERS (USER DATA)
    // -------------------------
    const unregistered = approved.filter(
      u => u.registered === false
    )
    
    const presentUsers = users.filter(
      u => u.hostelStatus === 'IN'
    )

    const vegUsers = users.filter(
      u => u.foodPreference === 'Veg'
    )

    const dontEatChickenUsers = users.filter(
      u => u.dontEat?.includes('Chicken')
    )

    const dontEatFishUsers = users.filter(
      u => u.dontEat?.includes('Fish')
    )

    const dontEatEggUsers = users.filter(
      u => u.dontEat?.includes('Egg')
    )

    // =========================
    // A. PRESENT NOW CARD
    // =========================
    const presentNowStats = {
      totalPresentNow: presentUsers.length,
      totalVegPresentNow: presentUsers.filter(u => u.foodPreference === 'Veg').length,
      totalDontEatChickenPresentNow: presentUsers.filter(u => u.dontEat?.includes('Chicken')).length,
      totalDontEatFishPresentNow: presentUsers.filter(u => u.dontEat?.includes('Fish')).length,
      totalDontEatEggPresentNow: presentUsers.filter(u => u.dontEat?.includes('Egg')).length
    }

    // =========================
    // B. TOTAL STUDENTS CARD
    // =========================
    const totalStats = {
      totalStudents: approved.length,
      totalVegStudents: vegUsers.length,
      totalDontEatChickenStudents: dontEatChickenUsers.length,
      totalDontEatFishStudents: dontEatFishUsers.length,
      totalDontEatEggStudents: dontEatEggUsers.length
    }

    const totalUnregistered = {
      unregisteredStudents: unregistered.length
    }

    // =========================
    // RESPONSE
    // =========================
    res.json({
      presentNow: presentNowStats,
      total: totalStats,
      unregisteredNow: totalUnregistered
    })

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export default {
    toggleHostelStatus,
    getHostelStats
}