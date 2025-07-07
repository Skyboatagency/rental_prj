const { Admin } = require('../models');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'fbouazi3@gmail.com',
    pass: 'rgzfplsukpdhtohr' // Remplacez par votre mot de passe d'application Gmail
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Stockage temporaire des codes de vérification
const verificationCodes = new Map();

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new admin
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Générer un code de vérification
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    verificationCodes.set(email, {
      code: verificationCode,
      data: {
        ...req.body,
        password: password // Suppression du hachage ici car il est géré par le modèle
      },
      timestamp: Date.now()
    });

    // Envoyer l'email avec le code
    await transporter.sendMail({
      from: 'fbouazi3@gmail.com',
      to: email,
      subject: 'Code de vérification - Inscription Administrateur',
      html: `
        <h1>Bienvenue !</h1>
        <p>Votre code de vérification est : <strong>${verificationCode}</strong></p>
        <p>Ce code expirera dans 10 minutes.</p>
      `
    });

    res.status(200).json({ message: 'Code de vérification envoyé avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du code de vérification' });
  }
};

// Verify admin registration
exports.verifyAdmin = async (req, res) => {
  try {
    const { email, code } = req.body;
    const verificationData = verificationCodes.get(email);

    if (!verificationData) {
      return res.status(400).json({ message: 'Code de vérification expiré ou invalide' });
    }

    // Vérifier si le code a expiré (10 minutes)
    if (Date.now() - verificationData.timestamp > 10 * 60 * 1000) {
      verificationCodes.delete(email);
      return res.status(400).json({ message: 'Code de vérification expiré' });
    }

    // Vérifier le code
    if (verificationData.code !== code) {
      return res.status(400).json({ message: 'Code de vérification incorrect' });
    }

    // Créer l'admin
    const admin = await Admin.create(verificationData.data);
    
    // Supprimer le code de vérification
    verificationCodes.delete(email);

    res.status(201).json({ message: 'Inscription réussie', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    await admin.update(req.body);
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    await admin.destroy();
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion pour:', email);

    // Vérifier si l'admin existe
    const admin = await Admin.findOne({ where: { email } });
    console.log('Admin trouvé:', admin ? 'Oui' : 'Non');
    
    if (!admin) {
      console.log('Admin non trouvé dans la base de données');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    console.log('Comparaison des mots de passe...');
    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log('Mot de passe valide:', isValidPassword ? 'Oui' : 'Non');

    if (!isValidPassword) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Retourner les informations de l'admin (sans le mot de passe)
    const adminData = {
      id: admin.id,
      nom: admin.nom,
      prenom: admin.prenom,
      email: admin.email,
      nomLocation: admin.nomLocation,
      adresse: admin.adresse,
      telephone: admin.telephone,
      ville: admin.ville
    };

    console.log('Connexion réussie pour:', email);
    res.status(200).json(adminData);
  } catch (error) {
    console.error('Erreur détaillée lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
}; 