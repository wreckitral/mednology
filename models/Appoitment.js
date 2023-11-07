const mongoose = require("mongoose");

const appoitmentSchema = new mongoose.Schema({
  /* "Misal, This appoitment was made because 
    the patient said that she needs to get her 
    stomach checked because it was hurt" */
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  clinicAddress: {
    type: String,
    required: [true, "Clinic address is required"]
  },
  date: Date,
  progress: [
    {
      type: String,
      default: "dijadwalkan",
    },
  ],
  isConfirmed: Boolean,
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Appoitment = mongoose.model("Appoitment", appoitmentSchema);

module.exports = Appoitment;

/* yang pacak ngatur janji temu/appoitment itu cuma dokter, mereka deal deal an tanggal dan tempat di WA
    trus baru dokter yang ngatur jadwal nyo di website, tapi user tetap biso setuju atau idak
*/

/* alur nyo cak ini, agek tuh pasien booking dokter dulu,
nah abis pembayaran, baru biso dokter bukak rekam medis pasien (biso pakek metode persetujuan pasien dulu)
nah ngambek user email dari rekam medis, backend send email ke pasien minta persetujuan janji temu
*/

/* kalo sempet cubo pakek googlemaps api buat narok alamat klinik, jadi user tinggal klik */