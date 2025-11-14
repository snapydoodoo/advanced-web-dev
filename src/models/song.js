import db from '../config/database-songs.js'

// Define the User model
class song {
	// Table schema definition
	static tableName = 'songs'
	
	// Create the users table
	static createTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS ${this.tableName} (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				title TEXT NOT NULL,
				artist TEXT,
				album TEXT,
				duration int,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`
		db.exec(sql)
		console.log(`✅ Table '${this.tableName}' created/verified`)
	}
	
	// Get all users
	
	static findAll() {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} ORDER BY title`)
		return stmt.all()
	}
	
	// Find song by ID
	static findById(id) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
		return stmt.get(id)
	}

	// Find song by title
	static findBytitle(title) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE  title= ?`)
		return stmt.get(title)
	}
	
	// Find song by artist
	static findByartist(artist) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE artist = ?`)
		return stmt.get(artist)
	}
	// find song by album 
	static findByalbum(album) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE album = ?`)
		return stmt.get(album)
	}


	
	// add new song
	static create(songData) {
		const { title, artist, album,duration } = songData
		const stmt = db.prepare(`
			INSERT INTO ${this.tableName} (title, artist, album,duration) 
			VALUES (?,?, ?,?)
		`)
		const result = stmt.run(title, artist, album,duration || null)
		return this.findById(result.lastInsertRowid)
	}
	
	// Update user
	static update(id, songData) {
		const { title, artist, album,duration } = songData
		
		// Build dynamic update query based on provided fields
		const updates = []
		const values = []
		
		if (title !== undefined) {
			updates.push('title = ?')
			values.push(title)
		}

		if (artist !== undefined) {
			updates.push('artist = ?')
			values.push(artist)
		}
		
		if (album !== undefined) {
			updates.push('album = ?')
			values.push(album)
		}
		if (duration !== undefined) {
			updates.push('duration = ?')
			values.push(duration)
		}
		
		// Always update the updated_at timestamp
		updates.push('updated_at = CURRENT_TIMESTAMP')
		
		if (updates.length === 1) {
			// Only timestamp update, nothing to change
			return this.findById(id)
		}
		
		values.push(id)
		
		const stmt = db.prepare(`
			UPDATE ${this.tableName} 
			SET ${updates.join(', ')} 
			WHERE id = ?
		`)
		
		stmt.run(...values)
		return this.findById(id)
	}
	
	// Delete song
	static delete(id) {
		const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
		const result = stmt.run(id)
		return result.changes > 0
	}
	
	// Check if email exists (excluding a specific user ID)
	// static emailExists(email, excludeId = null) {
	// 	let stmt
	// 	if (excludeId) {
	// 		stmt = db.prepare(`SELECT id FROM ${this.tableName} WHERE email = ? AND id != ?`)
	// 		return stmt.get(email, excludeId) !== undefined
	// 	} else {
	// 		stmt = db.prepare(`SELECT id FROM ${this.tableName} WHERE email = ?`)
	// 		return stmt.get(email) !== undefined
	// 	}
	// }
	
	// Count total users
	static count() {
		const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`)
		return stmt.get().count
	}
	
	// Seed sample data
	static seed() {
		const count = this.count()
		
		if (count === 0) {
			console.log('📝 Seeding songs table...')
			
			const samplesongs = [
				{ title: 'Everything in Its Right Place', artist:"Radiohead", duration: 4, album: 'kid A'},
				{ title: 'billie jean', artist:"micheal jackson",duration: 4, album: 'thriller' },
				{ title: 'Rehab', artist:"Amy Winehouse",duration: 3 , album: 'back to black'},
				{ title: 'Thank you', artist:"Led Zeppelin ",duration: 4, album: 'Led zeppelin II' }
			]

			samplesongs.forEach(song => this.create(song))
			console.log(`✅ Seeded ${samplesongs.length} song`)
		}
	}
}

export default song