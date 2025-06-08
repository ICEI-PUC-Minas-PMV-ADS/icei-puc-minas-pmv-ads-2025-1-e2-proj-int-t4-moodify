// Estado global da aplicação
let selectedMood = null;
let selectedGenres = [];
let currentPlaylist = null;

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeSpotifyUI();
        setupMoodSelection();
        setupGenreSelection();
        setupPlayerControls();
    } catch (error) {
        console.error('Erro na inicialização:', error);
    }
});

// Inicializa a interface do Spotify
function initializeSpotifyUI() {
    const connectButton = document.getElementById('spotify-connect');
    const spotifyStatus = document.getElementById('spotify-status');

    if (!connectButton || !spotifyStatus) {
        console.error('Elementos do Spotify não encontrados na página');
        console.log('connectButton:', connectButton);
        console.log('spotifyStatus:', spotifyStatus);
        return;
    }
    
    console.log('Elementos do Spotify encontrados:', { connectButton, spotifyStatus });
    
    // Debug: verificar se há múltiplos botões
    const allSpotifyButtons = document.querySelectorAll('#spotify-connect');
    console.log('Número de botões spotify-connect encontrados:', allSpotifyButtons.length);
    
    // Debug: testar clique direto
    console.log('Adicionando event listener ao botão...');

    // Verifica se já está conectado
    try {
        if (spotify && spotify.isAuthenticated()) {
            showSpotifyConnected();
        } else {
            showSpotifyDisconnected();
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação Spotify:', error);
        showSpotifyDisconnected();
    }

    // Adiciona o event listener inicial
    setupSpotifyButtonListener();
}

// Função separada para configurar o event listener do botão Spotify
function setupSpotifyButtonListener() {
    const connectButton = document.getElementById('spotify-connect');
    
    if (!connectButton) {
        console.warn('Botão spotify-connect não encontrado para adicionar listener');
        return;
    }
    
    // Remove listeners anteriores (se existirem)
    connectButton.replaceWith(connectButton.cloneNode(true));
    const newButton = document.getElementById('spotify-connect');
    
    console.log('Event listener sendo adicionado ao botão...');
    
    newButton.addEventListener('click', function(event) {
      event.preventDefault();
        console.log('🔥 BOTÃO CLICADO! Event:', event);
        console.log('Botão Conectar clicado!');
        console.log('Spotify objeto:', spotify);
        
        try {
            if (spotify && spotify.isAuthenticated()) {
                console.log('Usuário já autenticado, fazendo logout...');
                spotify.logout();
                showSpotifyDisconnected();
            } else if (spotify) {
                console.log('Fazendo login no Spotify...');
                console.log('URL de autenticação:', spotify.getAuthUrl());
                spotify.login();
            } else {
                console.error('Objeto spotify não encontrado');
                alert('Erro: SDK do Spotify não carregado');
            }
        } catch (error) {
            console.error('Erro no botão do Spotify:', error);
            alert('Erro ao conectar com Spotify: ' + error.message);
        }
    });
    
    // Método 2: Delegação de eventos (backup)
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'spotify-connect') {
            console.log('🚀 CLIQUE DETECTADO VIA DELEGAÇÃO!');
        }
    });
}

// Mostra estado conectado do Spotify
function showSpotifyConnected() {
    const spotifyStatus = document.getElementById('spotify-status');
    spotifyStatus.innerHTML = `
        <h3 style="color: white; margin-bottom: 1rem;">✅ Conectado ao Spotify!</h3>
        <p style="color: #b3b3b3; margin-bottom: 1rem;">Selecione seu humor e gêneros favoritos para criar sua playlist personalizada</p>
        <button id="spotify-connect" class="btn" style="background: #dc3545; color: white; border: none; padding: 0.8rem 2rem; border-radius: 25px; font-weight: bold; cursor: pointer;">
            Desconectar
        </button>
    `;
    
    // Mostra o botão de ativação do player
    const playerActivation = document.getElementById('player-activation');
    if (playerActivation) {
        playerActivation.style.display = 'block';
    }
    
    // Re-adiciona o event listener após recriar o botão
    setupSpotifyButtonListener();
    setupPlayerActivationButton();
}

// Mostra estado desconectado do Spotify
function showSpotifyDisconnected() {
    const spotifyStatus = document.getElementById('spotify-status');
    spotifyStatus.innerHTML = `
        <h3 style="color: white; margin-bottom: 1rem;">🎵 Conecte ao Spotify para uma experiência musical completa!</h3>
        <p style="color: #b3b3b3; margin-bottom: 1rem;">Acesse milhões de músicas e crie playlists baseadas no seu humor</p>
        <button id="spotify-connect" class="btn" style="background: #1db954; color: white; border: none; padding: 0.8rem 2rem; border-radius: 25px; font-weight: bold; cursor: pointer;">
            Conectar ao Spotify
        </button>
    `;
    
    // Esconde o botão de ativação do player
    const playerActivation = document.getElementById('player-activation');
    if (playerActivation) {
        playerActivation.style.display = 'none';
    }
    
    // Re-adiciona o event listener após recriar o botão
    setupSpotifyButtonListener();
}

// Configura botão de ativação do player
function setupPlayerActivationButton() {
    const activateButton = document.getElementById('activate-player');
    const activateAccountButton = document.getElementById('activate-account');
    
    if (!activateButton) {
        console.warn('Botão de ativação não encontrado');
        return;
    }
    
    // Remove listeners anteriores
    activateButton.replaceWith(activateButton.cloneNode(true));
    const newButton = document.getElementById('activate-player');
    
    newButton.addEventListener('click', async function() {
        console.log('🎯 Usuário clicou para ativar player');
        
        try {
            this.disabled = true;
            this.textContent = '⏳ Ativando...';
            
            if (!spotify.isAuthenticated()) {
                alert('Conecte-se ao Spotify primeiro!');
                return;
            }
            
            // Verifica status da conta
            const premiumStatus = await spotify.checkPremiumStatus();
            const recentPlayback = await spotify.checkRecentPlayback();
            
            console.log('📊 Status Premium:', premiumStatus);
            console.log('🎵 Reprodução recente:', recentPlayback);
            
            // Se não tem Premium
            if (!premiumStatus.hasPremium) {
                this.textContent = '❌ Premium Necessário';
                this.style.background = '#dc3545';
                alert(`💎 Spotify Premium necessário!\n\nTipo de conta atual: ${premiumStatus.product}\n\nFaça upgrade em spotify.com/premium`);
                this.disabled = false;
                return;
            }
            
            // Se não tem reprodução recente, mostra botão especial
            if (!recentPlayback.hasRecentPlayback) {
                this.textContent = '⚠️ Conta Inativa';
                this.style.background = '#ff6b35';
                
                // Mostra botão de ativar conta
                if (activateAccountButton) {
                    activateAccountButton.style.display = 'inline-block';
                }
                
                alert('🚨 Conta Spotify inativa!\n\nVocê precisa tocar uma música no Spotify primeiro.\nClique no botão "Ativar Conta Spotify" que apareceu.');
                this.disabled = false;
                return;
            }
            
            // Inicializa player se necessário
            if (!spotify.device_id) {
                await spotify.initializePlayer();
                await spotify.waitForPlayerReady();
            }
            
            // Tenta ativar o dispositivo
            const activated = await spotify.activateDevice();
            
            if (activated) {
                this.textContent = '✅ Pronto para Reproduzir!';
                this.style.background = '#1db954';
                
                // Esconde botão de ativar conta se estiver visível
                if (activateAccountButton) {
                    activateAccountButton.style.display = 'none';
                }
                
                // Atualiza a mensagem para mostrar próximos passos
                const playerActivation = document.getElementById('player-activation');
                if (playerActivation) {
                    playerActivation.innerHTML = `
                        <p style="color: #1db954; font-size: 0.9rem; margin-bottom: 0.5rem;">
                            ✅ Player preparado! Agora selecione seu humor e gêneros abaixo e clique em Play.
                        </p>
                        <small style="color: #b3b3b3; font-size: 0.8rem;">
                            💡 Dica: Se a reprodução não funcionar no navegador, o sistema abrirá automaticamente no app do Spotify.
                        </small>
                    `;
                }
            } else {
                this.textContent = '⚠️ Tente Novamente';
                this.style.background = '#ff6b35';
                this.disabled = false;
            }
            
        } catch (error) {
            console.error('Erro ao ativar player:', error);
            this.textContent = '❌ Erro - Tente Novamente';
            this.style.background = '#dc3545';
            this.disabled = false;
        }
    });
    
    // Configura botão de ativar conta
    if (activateAccountButton) {
        activateAccountButton.addEventListener('click', function() {
            const instructions = 
                '🎵 COMO ATIVAR SUA CONTA SPOTIFY:\n\n' +
                '1. Abra o app do Spotify no seu celular/computador\n' +
                '2. Toque QUALQUER música e deixe tocar por 10 segundos\n' +
                '3. Volte aqui e clique em "Ativar Player Web" novamente\n\n' +
                '💡 Isso "desperta" sua conta para reprodução via navegador.\n\n' +
                'Clique OK para abrir o Spotify Web Player em uma nova aba.';
            
            const openSpotify = confirm(instructions);
            
            if (openSpotify) {
                window.open('https://open.spotify.com', '_blank');
            }
        });
    }
}

// Configura seleção de humor
function setupMoodSelection() {
    const moodItems = document.querySelectorAll('.mood-item');
    
    moodItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove seleção anterior
            moodItems.forEach(m => m.classList.remove('selected'));
            
            // Adiciona seleção atual
            this.classList.add('selected');
            selectedMood = this.dataset.mood;
            
            console.log('Humor selecionado:', selectedMood);
            
            // Scroll automático para a seção de gêneros
            const genreSection = document.getElementById('services');
            if (genreSection) {
                setTimeout(() => {
                    // Scroll suave para a seção de gêneros
                    genreSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Adiciona um efeito visual temporário para destacar a seção
                    const genreTitle = genreSection.querySelector('h2');
                    if (genreTitle) {
                        genreTitle.style.color = '#8E35A0';
                        genreTitle.style.textShadow = '0 0 10px rgba(142, 53, 160, 0.5)';
                        genreTitle.style.transition = 'all 0.3s ease';
                        
                        // Remove o efeito após 2 segundos
                        setTimeout(() => {
                            genreTitle.style.textShadow = 'none';
                        }, 2000);
                    }
                }, 300); // Pequeno delay para dar feedback visual da seleção
            }
            
            // Se já tem gêneros selecionados, pode criar playlist
            if (selectedGenres.length > 0) {
                checkAndCreatePlaylist();
            }
        });
    });
}

// Configura seleção de gêneros
function setupGenreSelection() {
    const genreItems = document.querySelectorAll('.genre-item');
    
    genreItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const genre = this.dataset.genre;
            
            // Toggle selection
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                selectedGenres = selectedGenres.filter(g => g !== genre);
            } else {
                this.classList.add('selected');
                selectedGenres.push(genre);
            }
            
            console.log('Gêneros selecionados:', selectedGenres);
            
            // Se já tem humor selecionado, pode criar playlist
            if (selectedMood && selectedGenres.length > 0) {
                checkAndCreatePlaylist();
            }
  });
});
}

// Verifica e cria playlist se possível
function checkAndCreatePlaylist() {
    if (!spotify.isAuthenticated()) {
        alert('Conecte-se ao Spotify primeiro para criar playlists!');
        return;
    }
    
    if (selectedMood && selectedGenres.length > 0) {
        createMoodPlaylist();
    }
}

// Cria playlist baseada no humor e gêneros
async function createMoodPlaylist() {
    try {
        showLoading(true);
        
        console.log('Criando playlist para:', selectedMood, selectedGenres);
        
        const playlist = await spotify.createMoodPlaylist(selectedMood, selectedGenres);
        currentPlaylist = playlist;
        
        // Atualiza UI
        document.getElementById('current-mood').textContent = `${selectedMood} • ${selectedGenres.join(', ')}`;
        showPlaylistUI(playlist);
        
        // Notifica se playlist foi criada no Spotify
        if (playlist.spotifyPlaylist) {
            console.log('✅ Playlist salva no Spotify:', playlist.spotifyPlaylist.name);
            
            // Atualiza o nome da playlist na UI para mostrar que foi salva
            const currentMoodEl = document.getElementById('current-mood');
            if (currentMoodEl) {
                currentMoodEl.innerHTML = `
                    ${selectedMood} • ${selectedGenres.join(', ')}<br>
                    <small style="color: #1db954;">✅ Salva no Spotify: ${playlist.spotifyPlaylist.name}</small>
                `;
            }
        }
        
        // Inicializa player se necessário
        if (!spotify.device_id) {
            await spotify.initializePlayer();
        }
        
        showLoading(false);
        
    } catch (error) {
        console.error('Erro ao criar playlist:', error);
        alert('Erro ao criar playlist: ' + error.message);
        showLoading(false);
    }
}

// Mostra/esconde loading
function showLoading(show) {
    const loadingText = show ? 'Criando sua playlist personalizada...' : '';
    // Implementar indicador visual de loading
}

// Mostra a UI da playlist
function showPlaylistUI(playlist) {
    const playerSection = document.getElementById('music-player');
    const playlistTracks = document.getElementById('playlist-tracks');
    
    // Mostra seção do player
    playerSection.style.display = 'block';
    
    // Renderiza lista de músicas
    playlistTracks.innerHTML = playlist.tracks.map((track, index) => `
        <div class="track-item" style="display: flex; align-items: center; padding: 0.5rem; border-bottom: 1px solid #444; cursor: pointer;" onclick="playTrackFromPlaylist(${index})">
            <img src="${track.album.images[0]?.url || ''}" alt="${track.name}" style="width: 50px; height: 50px; border-radius: 5px; margin-right: 1rem;">
            <div style="flex: 1; color: white;">
                <div style="font-weight: bold;">${track.name}</div>
                <div style="color: #b3b3b3; font-size: 0.9rem;">${track.artists.map(a => a.name).join(', ')}</div>
            </div>
            <div style="color: #b3b3b3; font-size: 0.9rem;">
                ${Math.floor(track.duration_ms / 60000)}:${Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
            </div>
        </div>
    `).join('');
    
    // Scroll para o player
    playerSection.scrollIntoView({ behavior: 'smooth' });
}

// Toca música específica da playlist
window.playTrackFromPlaylist = async function(index) {
    if (!currentPlaylist || !spotify.isAuthenticated()) return;
    
    try {
        const track = currentPlaylist.tracks[index];
        
        // Tenta reproduzir no Web Player primeiro
        try {
            await spotify.playTrack(track.uri);
            console.log('✅ Tocando música no Web Player:', track.name);
        } catch (webPlayerError) {
            console.warn('❌ Web Player falhou, abrindo no Spotify:', webPlayerError);
            
            // Oferece opções para o usuário
            if (currentPlaylist.spotifyPlaylist && currentPlaylist.spotifyPlaylist.url) {
                const choice = confirm(
                    `Não foi possível reproduzir no navegador.\n\n` +
                    `Escolha uma opção:\n` +
                    `• OK: Abrir playlist completa no Spotify\n` +
                    `• Cancelar: Abrir apenas esta música\n\n` +
                    `Música atual: "${track.name}"`
                );
                
                if (choice) {
                    // Abre a playlist completa
                    window.open(currentPlaylist.spotifyPlaylist.url, '_blank');
                } else {
                    // Abre apenas a música individual
                    const spotifyUrl = track.external_urls.spotify;
                    window.open(spotifyUrl, '_blank');
                }
            } else {
                // Fallback: Abre apenas a música no Spotify
                const spotifyUrl = track.external_urls.spotify;
                const userChoice = confirm(
                    `Não foi possível reproduzir no navegador.\n\n` +
                    `Deseja abrir "${track.name}" no app do Spotify?`
                );
                
                if (userChoice) {
                    window.open(spotifyUrl, '_blank');
                }
            }
        }
    } catch (error) {
        console.error('Erro ao tocar música:', error);
        alert('Erro ao tocar música: ' + error.message);
    }
};

// Configura controles do player
function setupPlayerControls() {
    const playButton = document.getElementById('play-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const generateButton = document.getElementById('generate-new-playlist');
    
    playButton?.addEventListener('click', async function() {
        if (!spotify.isAuthenticated()) {
            alert('Conecte-se ao Spotify primeiro!');
            return;
        }
        
        try {
            if (!currentPlaylist) {
                if (selectedMood && selectedGenres.length > 0) {
                    await createMoodPlaylist();
                } else {
                    alert('Selecione um humor e pelo menos um gênero primeiro!');
                    return;
                }
            }
            
            // Verifica se o player precisa ser ativado
            if (!spotify.device_id) {
                const userChoice = confirm(
                    '🎵 PARA TOCAR NO NAVEGADOR:\n\n' +
                    '1. Primeiro abra o Spotify (app ou web)\n' +
                    '2. Toque QUALQUER música por alguns segundos\n' +
                    '3. Volte aqui e clique em "Ativar Player Web"\n' +
                    '4. Depois tente tocar novamente\n\n' +
                    'Clique OK para ver o botão de ativação\n' +
                    'Ou CANCELAR para abrir direto no Spotify'
                );
                
                if (userChoice) {
                    // Mostra o botão de ativação
                    const playerActivation = document.getElementById('player-activation');
                    if (playerActivation) {
                        playerActivation.style.display = 'block';
                        alert('✅ Botão "Ativar Player Web" apareceu acima!\n\nLembre-se: Abra o Spotify primeiro e toque uma música!');
                        return;
                    }
                } else {
                    // Abre no Spotify
                    if (currentPlaylist.spotifyPlaylist && currentPlaylist.spotifyPlaylist.url) {
                        window.open(currentPlaylist.spotifyPlaylist.url, '_blank');
                    }
                    return;
                }
            }
            
            // Tenta reproduzir no Web Player primeiro
            try {
                console.log('🎵 Tentando reproduzir no navegador...');
                await spotify.playPlaylist(currentPlaylist.uris);
                console.log('✅ Reproduzindo no Web Player');
                
                // Configura controles funcionais
                setupPlaybackControls();
                
                console.log('🎵 Sucesso! Reproduzindo no navegador.');
                return; // Sai da função se deu certo
                
            } catch (webPlayerError) {
                console.warn('❌ Web Player falhou:', webPlayerError);
                
                // Aguarda um momento e verifica se a música está tocando
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Verifica se mesmo com erro, a música está tocando
                if (spotify.player) {
                    try {
                        const state = await spotify.player.getCurrentState();
                        if (state && !state.paused) {
                            console.log('✅ Apesar do erro inicial, música está tocando! Configurando controles...');
                            setupPlaybackControls();
                            return; // Sai sem mostrar erro pois está funcionando
                        }
                    } catch (stateError) {
                        console.warn('Não foi possível verificar estado do player:', stateError);
                    }
                }
                
                // Se chegou aqui e há uma playlist criada, mostra opção positiva
                if (currentPlaylist && currentPlaylist.spotifyPlaylist) {
                    console.log('🎵 Playlist criada com sucesso no Spotify!');
                    
                    const userChoice = confirm(
                        `🎵 PLAYLIST CRIADA COM SUCESSO!\n\n` +
                        `"${currentPlaylist.spotifyPlaylist.name}"\n` +
                        `Total: ${currentPlaylist.tracks.length} músicas\n\n` +
                        `A playlist está salva na sua biblioteca do Spotify.\n\n` +
                        `Clique OK para abrir no Spotify agora!`
                    );
                    
                    if (userChoice) {
                        window.open(currentPlaylist.spotifyPlaylist.url, '_blank');
                    }
                    
                    // Tenta configurar controles mesmo assim
                    setTimeout(async () => {
                        if (spotify.player) {
                            try {
                                const state = await spotify.player.getCurrentState();
                                if (state) {
                                    console.log('✅ Player ativo detectado! Configurando controles...');
                                    setupPlaybackControls();
                                }
                            } catch (e) {
                                console.log('Player web não ativo, mas playlist criada com sucesso');
                            }
                        }
                    }, 2000);
                    
                    return; // Não mostra mensagem de erro se playlist foi criada
                }
                
                // Determina o tipo de erro para dar uma mensagem mais específica
                let errorMessage = 'Não foi possível reproduzir no navegador.';
                let solutions = [];
                let isSpecialError = false;
                
                if (webPlayerError.message === '403_NO_RECENT_PLAYBACK') {
                    errorMessage = '🚨 Conta Spotify inativa detectada!';
                    solutions = [
                        '🎵 SOLUÇÃO SIMPLES:',
                        '1. Abra o app do Spotify no seu celular/computador',
                        '2. Toque QUALQUER música por alguns segundos',
                        '3. Volte aqui e tente novamente',
                        '',
                        '💡 Isso "ativa" sua conta para reprodução via API'
                    ];
                    isSpecialError = true;
                } else if (webPlayerError.message.includes('Spotify Premium necessário')) {
                    errorMessage = '💎 Spotify Premium necessário!';
                    solutions = [
                        '• Upgrade para Spotify Premium em spotify.com/premium',
                        '• Ou use o botão "Abrir Playlist no Spotify" abaixo',
                        '• A playlist foi criada e salva na sua biblioteca!'
                    ];
                    isSpecialError = true;
                } else if (webPlayerError.message.includes('403')) {
                    errorMessage = 'Reprodução no navegador bloqueada (Erro 403).';
                    solutions = [
                        '• Abra o Spotify e toque uma música primeiro',
                        '• Certifique-se de ter Spotify Premium ativo',
                        '• Tente desconectar e reconectar ao Spotify',
                        '• Ou abra a playlist no app do Spotify'
                    ];
                } else if (webPlayerError.message.includes('404')) {
                    errorMessage = 'Nenhum dispositivo ativo encontrado.';
                    solutions = [
                        '• Abra o app do Spotify e toque qualquer música',
                        '• Volte aqui e tente novamente',
                        '• Ou use o botão "Abrir Playlist no Spotify" abaixo'
                    ];
                } else {
                    solutions = [
                        '• Verifique sua conexão com internet',
                        '• Tente recarregar a página',
                        '• Ou abra no app do Spotify'
                    ];
                }
                
                // Para erros especiais, mostra instruções mais detalhadas
                if (isSpecialError) {
                    if (webPlayerError.message === '403_NO_RECENT_PLAYBACK') {
                        // Erro especial: conta inativa
                        const userChoice = confirm(
                            `${errorMessage}\n\n` +
                            `${solutions.join('\n')}\n\n` +
                            `Quer abrir a playlist no Spotify agora para testar?`
                        );
                        
                        if (userChoice && currentPlaylist.spotifyPlaylist) {
                            window.open(currentPlaylist.spotifyPlaylist.url, '_blank');
                        }
                    } else {
                        // Outros erros especiais (Premium, etc.)
                        alert(`${errorMessage}\n\n${solutions.join('\n')}`);
                        
                        // Abre playlist automaticamente se disponível
                        if (currentPlaylist.spotifyPlaylist) {
                            setTimeout(() => {
                                window.open(currentPlaylist.spotifyPlaylist.url, '_blank');
                            }, 1000);
                        }
                    }
                } else {
                    // Tratamento padrão para outros erros
                    if (currentPlaylist.spotifyPlaylist && currentPlaylist.spotifyPlaylist.url) {
                        const userChoice = confirm(
                            `${errorMessage}\n\n` +
                            `Soluções possíveis:\n${solutions.join('\n')}\n\n` +
                            `Playlist criada: ${currentPlaylist.spotifyPlaylist.name}\n` +
                            `Total: ${currentPlaylist.tracks.length} músicas\n\n` +
                            `Clique OK para abrir a playlist completa no Spotify`
                        );
                        
                        if (userChoice) {
                            window.open(currentPlaylist.spotifyPlaylist.url, '_blank');
                        }
                    } else if (currentPlaylist.tracks && currentPlaylist.tracks.length > 0) {
                        // Fallback: Abre a primeira música no Spotify
                        const firstTrack = currentPlaylist.tracks[0];
                        const spotifyUrl = firstTrack.external_urls.spotify;
                        
                        const userChoice = confirm(
                            `${errorMessage}\n\n` +
                            `Soluções possíveis:\n${solutions.join('\n')}\n\n` +
                            `Música: ${firstTrack.name} - ${firstTrack.artists.map(a => a.name).join(', ')}\n\n` +
                            `Clique OK para abrir no Spotify`
                        );
                        
                        if (userChoice) {
                            window.open(spotifyUrl, '_blank');
                        }
                    } else {
                        alert('Erro: Playlist vazia');
                    }
                }
            }
        } catch (error) {
            console.error('Erro geral no player:', error);
            alert('Erro no player: ' + error.message);
        }
    });
    
    prevButton?.addEventListener('click', async function() {
        try {
            await spotify.previousTrack();
        } catch (error) {
            console.error('Erro ao voltar música:', error);
        }
    });
    
    nextButton?.addEventListener('click', async function() {
        try {
            await spotify.nextTrack();
        } catch (error) {
            console.error('Erro ao pular música:', error);
        }
    });
    
    generateButton?.addEventListener('click', function() {
        if (selectedMood && selectedGenres.length > 0) {
            createMoodPlaylist();
        } else {
            alert('Selecione um humor e pelo menos um gênero primeiro!');
        }
    });
    
    // Botão "Abrir no Spotify"
    const openSpotifyButton = document.getElementById('open-in-spotify');
    openSpotifyButton?.addEventListener('click', function() {
        if (!currentPlaylist || !currentPlaylist.tracks || currentPlaylist.tracks.length === 0) {
            alert('Nenhuma playlist criada ainda!');
            return;
        }
        
        // Verifica se há uma playlist real criada no Spotify
        if (currentPlaylist.spotifyPlaylist && currentPlaylist.spotifyPlaylist.url) {
            const userChoice = confirm(
                `Abrir playlist completa no Spotify?\n\n` +
                `Playlist: ${currentPlaylist.spotifyPlaylist.name}\n` +
                `Total: ${currentPlaylist.tracks.length} músicas\n\n` +
                `A playlist foi salva na sua biblioteca do Spotify!`
            );
            
            if (userChoice) {
                window.open(currentPlaylist.spotifyPlaylist.url, '_blank');
            }
        } else {
            // Fallback: abre a primeira música se não conseguiu criar playlist
            const firstTrack = currentPlaylist.tracks[0];
            const spotifyUrl = firstTrack.external_urls.spotify;
            
            const userChoice = confirm(
                `Não foi possível criar playlist no Spotify.\n\n` +
                `Deseja abrir a primeira música?\n\n` +
                `Música: ${firstTrack.name} - ${firstTrack.artists.map(a => a.name).join(', ')}`
            );
            
            if (userChoice) {
                window.open(spotifyUrl, '_blank');
            }
        }
    });
}

// Configura controles de reprodução funcionais com botões separados
function setupPlaybackControls() {
    const playButton = document.getElementById('play-button');
    const pauseButton = document.getElementById('pause-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    console.log('🎮 Configurando controles de reprodução separados...');
    
    // Função para mostrar/esconder botões
    function showPlayButton() {
        if (playButton) playButton.style.display = 'flex';
        if (pauseButton) pauseButton.style.display = 'none';
    }
    
    function showPauseButton() {
        if (playButton) playButton.style.display = 'none';
        if (pauseButton) pauseButton.style.display = 'flex';
    }
    
    // Configura botão PLAY
    if (playButton) {
        const newPlayButton = playButton.cloneNode(true);
        playButton.parentNode.replaceChild(newPlayButton, playButton);
        
        newPlayButton.addEventListener('click', async function() {
            try {
                this.disabled = true;
                console.log('▶️ Botão PLAY clicado');
                
                if (!spotify.player) {
                    console.warn('❌ Player não inicializado');
                    alert('Player não está pronto! Tente ativar o player primeiro.');
                    return;
                }
                
                const state = await spotify.player.getCurrentState();
                
                if (!state) {
                    // Inicia playlist
                    console.log('🚀 Iniciando playlist...');
                    if (currentPlaylist && currentPlaylist.uris && currentPlaylist.uris.length > 0) {
                        await spotify.playPlaylist(currentPlaylist.uris);
                        showPauseButton();
                        console.log('✅ Playlist iniciada');
                    } else {
                        alert('Nenhuma playlist carregada!');
                    }
                } else {
                    // Retoma reprodução
                    console.log('▶️ Retomando reprodução...');
                    await spotify.resume();
                    showPauseButton();
                }
                
            } catch (error) {
                console.error('❌ Erro no botão PLAY:', error);
                alert('Erro: ' + error.message);
            } finally {
                this.disabled = false;
            }
        });
    }
    
    // Configura botão PAUSE
    if (pauseButton) {
        const newPauseButton = pauseButton.cloneNode(true);
        pauseButton.parentNode.replaceChild(newPauseButton, pauseButton);
        
        newPauseButton.addEventListener('click', async function() {
            try {
                this.disabled = true;
                console.log('⏸️ Botão PAUSE clicado');
                
                await spotify.pause();
                showPlayButton();
                console.log('⏸️ Música pausada');
                
                         } catch (error) {
                 console.error('❌ Erro no botão PAUSE:', error);
                 // Só mostra alerta se for erro real, não problema de JSON
                 if (!error.message.includes('Resposta inválida') && !error.message.includes('JSON')) {
                     alert('Erro ao pausar: ' + error.message);
                 }
             } finally {
                this.disabled = false;
            }
        });
    }
    
    // Configura botão ANTERIOR
    if (prevButton) {
        const newPrevButton = prevButton.cloneNode(true);
        prevButton.parentNode.replaceChild(newPrevButton, prevButton);
        
        newPrevButton.addEventListener('click', async function() {
            try {
                this.disabled = true;
                console.log('⏮️ Música anterior...');
                await spotify.previousTrack();
                
                // Força atualização da UI
                setTimeout(async () => {
                    await spotify.forceUpdatePlayerUI();
                }, 500);
                
                         } catch (error) {
                 console.error('❌ Erro ao voltar música:', error);
                 // Só mostra alerta se for erro real, não problema de JSON
                 if (!error.message.includes('Resposta inválida') && !error.message.includes('JSON')) {
                     alert('Erro ao voltar música: ' + error.message);
                 }
             } finally {
                this.disabled = false;
            }
        });
    }
    
    // Configura botão PRÓXIMO
    if (nextButton) {
        const newNextButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newNextButton, nextButton);
        
        newNextButton.addEventListener('click', async function() {
            try {
                this.disabled = true;
                console.log('⏭️ Próxima música...');
                await spotify.nextTrack();
                
                // Força atualização da UI
                setTimeout(async () => {
                    await spotify.forceUpdatePlayerUI();
                }, 500);
                
                         } catch (error) {
                 console.error('❌ Erro ao pular música:', error);
                 // Só mostra alerta se for erro real, não problema de JSON
                 if (!error.message.includes('Resposta inválida') && !error.message.includes('JSON')) {
                     alert('Erro ao pular música: ' + error.message);
                 }
             } finally {
                this.disabled = false;
            }
        });
    }
    
    // Atualiza botões automaticamente quando o estado muda
    if (spotify.player) {
        spotify.player.addListener('player_state_changed', (state) => {
            console.log('🔄 Estado do player mudou:', state);
            if (state) {
                if (state.paused) {
                    showPlayButton();
                } else {
                    showPauseButton();
                }
            }
        });
    }
    
    // Inicializa mostrando o botão PAUSE (já que a música acabou de começar)
    showPauseButton();
    
    console.log('✅ Controles separados configurados com sucesso');
}

// Estilos CSS para seleção
const style = document.createElement('style');
style.textContent = `
    .mood-item.selected,
    .genre-item.selected {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(142, 53, 160, 0.6);
        border: 2px solid #8E35A0;
    }
    
    .mood-item,
    .genre-item {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .mood-item:hover,
    .genre-item:hover {
        transform: scale(1.02);
    }
    
    .track-item:hover {
        background-color: #333 !important;
    }
`;
document.head.appendChild(style);
