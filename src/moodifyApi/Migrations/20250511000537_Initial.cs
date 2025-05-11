using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace moodifyApi.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Humores",
                columns: table => new
                {
                    HumorId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Icone = table.Column<string>(type: "TEXT", nullable: false),
                    Cor = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Humores", x => x.HumorId);
                });

            migrationBuilder.CreateTable(
                name: "Musicas",
                columns: table => new
                {
                    MusicaId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Titulo = table.Column<string>(type: "TEXT", nullable: false),
                    Artista = table.Column<string>(type: "TEXT", nullable: false),
                    Duracao = table.Column<TimeSpan>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Musicas", x => x.MusicaId);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    UsuarioId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.UsuarioId);
                });

            migrationBuilder.CreateTable(
                name: "HumorMusica",
                columns: table => new
                {
                    HumoresHumorId = table.Column<int>(type: "INTEGER", nullable: false),
                    MusicasMusicaId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HumorMusica", x => new { x.HumoresHumorId, x.MusicasMusicaId });
                    table.ForeignKey(
                        name: "FK_HumorMusica_Humores_HumoresHumorId",
                        column: x => x.HumoresHumorId,
                        principalTable: "Humores",
                        principalColumn: "HumorId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HumorMusica_Musicas_MusicasMusicaId",
                        column: x => x.MusicasMusicaId,
                        principalTable: "Musicas",
                        principalColumn: "MusicaId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HumorUsuario",
                columns: table => new
                {
                    HumoresAtuaisHumorId = table.Column<int>(type: "INTEGER", nullable: false),
                    UsuariosUsuarioId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HumorUsuario", x => new { x.HumoresAtuaisHumorId, x.UsuariosUsuarioId });
                    table.ForeignKey(
                        name: "FK_HumorUsuario_Humores_HumoresAtuaisHumorId",
                        column: x => x.HumoresAtuaisHumorId,
                        principalTable: "Humores",
                        principalColumn: "HumorId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HumorUsuario_Usuarios_UsuariosUsuarioId",
                        column: x => x.UsuariosUsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Playlists",
                columns: table => new
                {
                    PlaylistId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    DataDeCriacao = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UsuarioId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playlists", x => x.PlaylistId);
                    table.ForeignKey(
                        name: "FK_Playlists_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MusicaPlaylist",
                columns: table => new
                {
                    MusicasMusicaId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlaylistsPlaylistId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MusicaPlaylist", x => new { x.MusicasMusicaId, x.PlaylistsPlaylistId });
                    table.ForeignKey(
                        name: "FK_MusicaPlaylist_Musicas_MusicasMusicaId",
                        column: x => x.MusicasMusicaId,
                        principalTable: "Musicas",
                        principalColumn: "MusicaId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MusicaPlaylist_Playlists_PlaylistsPlaylistId",
                        column: x => x.PlaylistsPlaylistId,
                        principalTable: "Playlists",
                        principalColumn: "PlaylistId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HumorMusica_MusicasMusicaId",
                table: "HumorMusica",
                column: "MusicasMusicaId");

            migrationBuilder.CreateIndex(
                name: "IX_HumorUsuario_UsuariosUsuarioId",
                table: "HumorUsuario",
                column: "UsuariosUsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_MusicaPlaylist_PlaylistsPlaylistId",
                table: "MusicaPlaylist",
                column: "PlaylistsPlaylistId");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_UsuarioId",
                table: "Playlists",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HumorMusica");

            migrationBuilder.DropTable(
                name: "HumorUsuario");

            migrationBuilder.DropTable(
                name: "MusicaPlaylist");

            migrationBuilder.DropTable(
                name: "Humores");

            migrationBuilder.DropTable(
                name: "Musicas");

            migrationBuilder.DropTable(
                name: "Playlists");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
