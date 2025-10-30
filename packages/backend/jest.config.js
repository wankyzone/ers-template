/** @type {import('jest').Config} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/__tests__"],
	transform: {
		"^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
	},
	moduleFileExtensions: ["ts", "js", "json", "node"],
};
