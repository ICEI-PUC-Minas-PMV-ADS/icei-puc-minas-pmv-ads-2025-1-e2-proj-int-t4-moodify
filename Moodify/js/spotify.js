// Configurações do Spotify API
const SPOTIFY_CONFIG = {
    client_id: 'fd5faf9f3fdd4c4d95aaf3fc9c35ae3c', // Substitua pelo seu Client ID do Spotify Dashboard
    redirect_uri: 'https://moodify-acf8fzcfdffxece2.brazilsouth-01.azurewebsites.net/callback.html', // URL do Azure
    scopes: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private'
    ].join(' ')
};

class SpotifyAPI {
    constructor() {
        this.access_token = localStorage.getItem('spotify_access_token');
        this.player = null;
        this.device_id = null;
    }

    // Gera URL de autorização do Spotify
    getAuthUrl() {
        const params = new URLSearchParams({
            client_id: SPOTIFY_CONFIG.client_id,
            response_type: 'code',
            redirect_uri: SPOTIFY_CONFIG.redirect_uri,
            scope: SPOTIFY_CONFIG.scopes,
            show_dialog: true
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    // Verifica se o usuário está autenticado
    isAuthenticated() {
        return !!this.access_token;
    }

    // Faz login no Spotify
    login() {
        window.location.href = this.getAuthUrl();
    }

    // Faz logout do Spotify
    logout() {
        localStorage.removeItem('spotify_access_token');
        this.access_token = null;
        if (this.player) {
            this.player.disconnect();
        }
    }

    // Faz requisições para a API do Spotify
    async makeRequest(endpoint, options = {}) {
        if (!this.access_token) {
            throw new Error('Não autenticado no Spotify');
        }

        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            if (response.status === 401) {
                this.logout();
                throw new Error('Token expirado, faça login novamente');
            }
            
            // Tenta obter texto da resposta para debug
            let errorText = '';
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = 'Não foi possível obter detalhes do erro';
            }
            
            throw new Error(`Erro na API: ${response.status} - ${errorText}`);
        }

        // Verifica se há conteúdo para fazer parse
        const contentLength = response.headers.get('content-length');
        const contentType = response.headers.get('content-type');
        
        // Se não há conteúdo (204 No Content) ou content-length é 0, retorna objeto vazio
        if (response.status === 204 || contentLength === '0') {
            console.log('✅ Requisição bem-sucedida (sem conteúdo)');
            return {};
        }
        
        // Se não é JSON, retorna texto
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.log('⚠️ Resposta não é JSON:', text);
            return { text: text };
        }
        
        // Tenta fazer parse JSON
        try {
            return await response.json();
        } catch (jsonError) {
            console.error('❌ Erro ao fazer parse JSON:', jsonError);
            const text = await response.text();
            console.log('📄 Conteúdo da resposta:', text);
            throw new Error(`Resposta inválida da API: ${text.substring(0, 100)}...`);
        }
    }

    // Busca músicas por humor e gênero
    async searchByMoodAndGenre(mood, genres, limit = 20) {
        const moodKeywords = {
            'seguir-o-flow': 'chill ambient relaxing lounge',
            'estudar': 'instrumental focus classical acoustic',
            'festejar': 'party dance upbeat energetic',
            'jogar': 'electronic energetic gaming rock',
            'relaxar': 'calm peaceful meditation acoustic chill'
        };

        const genreMap = {
            'sertanejo': 'sertanejo country brazilian',
            'rock': 'rock alternative indie',
            'kpop': 'k-pop korean pop',
            'mpb': 'mpb brazilian bossa nova',
            'funk': 'funk brazilian hip-hop',
            'samba-pagode': 'samba pagode brazilian'
        };

        // Tentar diferentes estratégias de busca
        const searchStrategies = [
            // Estratégia 1: Gênero + humor
            genres.map(g => `${genreMap[g] || g} ${moodKeywords[mood] || mood}`).join(' OR '),
            
            // Estratégia 2: Apenas gêneros
            genres.map(g => genreMap[g] || g).join(' OR '),
            
            // Estratégia 3: Apenas humor
            moodKeywords[mood] || mood,
            
            // Estratégia 4: Busca mais ampla
            `${genres[0]} music`
        ];

        for (let i = 0; i < searchStrategies.length; i++) {
            try {
                console.log(`Tentativa ${i + 1}: "${searchStrategies[i]}"`);
                
                const result = await this.makeRequest(`/search?q=${encodeURIComponent(searchStrategies[i])}&type=track&limit=${limit}&market=BR`);
                
                if (result.tracks && result.tracks.items.length > 0) {
                    console.log(`✅ Sucesso na tentativa ${i + 1}:`, result.tracks.items.length, 'músicas encontradas');
                    return result;
                }
            } catch (error) {
                console.warn(`Tentativa ${i + 1} falhou:`, error);
            }
        }

        // Se todas as estratégias falharam, retorna busca genérica
        console.log('Todas as estratégias falharam, fazendo busca genérica...');
        return await this.makeRequest(`/search?q=${encodeURIComponent('popular music')}&type=track&limit=${limit}&market=BR`);
    }

    // Busca músicas por gênero específico
    async searchByGenre(genre, limit = 50) {
        const genreMap = {
            'sertanejo': 'sertanejo country',
            'rock': 'rock alternative',
            'kpop': 'k-pop korean',
            'mpb': 'mpb brazilian',
            'funk': 'funk brazilian',
            'samba-pagode': 'samba pagode brazilian'
        };

        const query = genreMap[genre] || genre;
        return await this.makeRequest(`/search?q=genre:"${query}"&type=track&limit=${limit}`);
    }

    // Inicializa o player do Spotify
    async initializePlayer() {
        return new Promise((resolve) => {
            if (window.Spotify) {
                this.setupPlayer(resolve);
            } else {
                // Define a função globalmente
                if (!window.onSpotifyWebPlaybackSDKReady) {
                    window.onSpotifyWebPlaybackSDKReady = () => {
                        this.setupPlayer(resolve);
                    };
                }
            }
        });
    }

    setupPlayer(resolve) {
        this.player = new Spotify.Player({
            name: 'Moodify Player',
            getOAuthToken: cb => { cb(this.access_token); },
            volume: 0.5
        });

        // Eventos do player
        this.player.addListener('ready', ({ device_id }) => {
            console.log('Player pronto com Device ID:', device_id);
            this.device_id = device_id;
            this.playerReady = true;
            resolve(device_id);
        });

        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID perdeu conexão:', device_id);
            this.playerReady = false;
        });

        this.player.addListener('player_state_changed', (state) => {
            if (state) {
                this.updatePlayerUI(state);
            }
        });

        // Adiciona listener para erros de inicialização
        this.player.addListener('initialization_error', ({ message }) => {
            console.error('Erro de inicialização do player:', message);
            this.playerReady = false;
        });

        this.player.addListener('authentication_error', ({ message }) => {
            console.error('Erro de autenticação do player:', message);
            this.playerReady = false;
        });

        this.player.addListener('account_error', ({ message }) => {
            console.error('Erro de conta do player:', message);
            this.playerReady = false;
        });

        this.player.addListener('playback_error', ({ message }) => {
            console.error('Erro de reprodução:', message);
        });

        // Conecta o player
        this.player.connect();
    }

    // Aguarda o player estar pronto
    async waitForPlayerReady(maxWait = 10000) {
        const startTime = Date.now();
        
        while (!this.playerReady && (Date.now() - startTime) < maxWait) {
            console.log('⏳ Aguardando player ficar pronto...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (!this.playerReady) {
            throw new Error('Player não ficou pronto dentro do tempo limite');
        }
        
        console.log('✅ Player está pronto para reprodução');
    }

    // Despertar o player com uma ação do usuário
    async wakeUpPlayer() {
        if (!this.player) {
            throw new Error('Player não inicializado');
        }

        try {
            console.log('⚡ Tentando ativar player com interação do usuário...');
            
            // Apenas registra a interação do usuário - não tenta controlar player vazio
            console.log('✅ Interação do usuário registrada');
            
            return true;
            
        } catch (error) {
            console.log('⚠️ Erro na interação:', error);
            return false;
        }
    }

    // Ativa o dispositivo Web Player
    async activateDevice() {
        if (!this.device_id) {
            throw new Error('Player não inicializado');
        }

        try {
            console.log('🔄 Preparando Web Player...');
            
            // Registra interação do usuário
            const userInteraction = await this.wakeUpPlayer();
            
            // Verifica dispositivos disponíveis
            const availableDevices = await this.getAvailableDevices();
            console.log('📱 Dispositivos encontrados:', availableDevices.length);
            
            // Verifica se nosso dispositivo está na lista
            const ourDevice = availableDevices.find(d => d.id === this.device_id);
            if (ourDevice) {
                console.log('✅ Web Player encontrado na lista de dispositivos');
                console.log('🎵 Status:', ourDevice.is_active ? 'Ativo' : 'Inativo');
                
                // Se já está ativo, não precisa fazer nada
                if (ourDevice.is_active) {
                    console.log('✅ Web Player já está ativo');
                    return true;
                }
                
                // Marca como pronto para uso (não ativo, mas disponível)
                console.log('✅ Web Player pronto para primeira reprodução');
                return true;
            } else {
                console.warn('⚠️ Web Player não encontrado na lista de dispositivos');
                return false;
            }
            
        } catch (error) {
            console.warn('⚠️ Erro ao verificar dispositivo:', error);
            // Retorna true mesmo com erro - pode funcionar na reprodução
            return true;
        }
    }

    // Toca uma música
    async playTrack(uri, position = 0) {
        if (!this.device_id) {
            await this.initializePlayer();
        }

        try {
            // Aguarda o player estar pronto
            await this.waitForPlayerReady();
            
            // Primeiro tenta ativar o dispositivo
            await this.activateDevice();
            
            console.log('🎵 Reproduzindo música:', uri);
            
            await this.makeRequest(`/me/player/play?device_id=${this.device_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    uris: [uri],
                    position_ms: position
                })
            });
            
        } catch (error) {
            // Se falhar, tenta novamente sem especificar device_id
            console.warn('⚠️ Tentativa com device_id falhou, tentando sem device_id...');
            
            try {
                await this.makeRequest('/me/player/play', {
                    method: 'PUT',
                    body: JSON.stringify({
                        uris: [uri],
                        position_ms: position
                    })
                });
            } catch (fallbackError) {
                console.error('❌ Ambas as tentativas de reprodução falharam:', fallbackError);
                throw fallbackError;
            }
        }
    }

    // Método para forçar primeira reprodução com interação do usuário
    async forceFirstPlay(uris) {
        try {
            console.log('🎯 Tentando primeira reprodução com interação do usuário...');
            
            // Usa o player SDK para tocar (requer interação do usuário)
            if (this.player) {
                await this.player.resume();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Agora tenta via API
            await this.makeRequest(`/me/player/play?device_id=${this.device_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    uris: uris.slice(0, 1) // Só a primeira música
                })
            });
            
            console.log('✅ Primeira reprodução bem-sucedida!');
            return true;
            
        } catch (error) {
            console.warn('⚠️ Primeira reprodução falhou:', error);
            return false;
        }
    }

    // Toca uma playlist
    async playPlaylist(uris) {
        if (!this.device_id) {
            await this.initializePlayer();
        }

        try {
            // Aguarda o player estar pronto
            await this.waitForPlayerReady();
            
            console.log('🎵 Iniciando reprodução de playlist com', uris.length, 'músicas');
            
            // Verifica status da conta antes de tentar reproduzir
            const premiumStatus = await this.checkPremiumStatus();
            const recentPlayback = await this.checkRecentPlayback();
            
            console.log('📊 Status da conta:', premiumStatus);
            console.log('🎵 Reprodução recente:', recentPlayback);
            
            // Se não tem Premium, falha imediatamente
            if (!premiumStatus.hasPremium) {
                throw new Error(`Spotify Premium necessário. Tipo de conta atual: ${premiumStatus.product || 'desconhecido'}`);
            }
            
            // Se não tem reprodução recente, avisa
            if (!recentPlayback.hasRecentPlayback) {
                console.warn('⚠️ Nenhuma reprodução recente detectada. Isto pode causar erro 403.');
            }
            
            // Estratégia 1: Reprodução direta com device_id
            console.log('🎯 Tentativa 1: Reprodução direta com device_id');
            try {
                await this.makeRequest(`/me/player/play?device_id=${this.device_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        uris: uris
                    })
                });
                console.log('✅ Reprodução iniciada com sucesso!');
                return;
            } catch (directError) {
                console.warn('⚠️ Reprodução direta falhou:', directError.message);
                
                // Se é erro 403 e não há reprodução recente, para aqui
                if (directError.message.includes('403') && !recentPlayback.hasRecentPlayback) {
                    throw new Error('403_NO_RECENT_PLAYBACK');
                }
            }
            
            // Estratégia 2: Transferir e reproduzir (apenas se não for 403 sem reprodução recente)
            console.log('🎯 Tentativa 2: Transferir dispositivo e reproduzir');
            try {
                await this.makeRequest('/me/player', {
                    method: 'PUT',
                    body: JSON.stringify({
                        device_ids: [this.device_id],
                        play: false
                    })
                });
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                await this.makeRequest(`/me/player/play?device_id=${this.device_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        uris: uris
                    })
                });
                console.log('✅ Reprodução após transferência bem-sucedida!');
                return;
            } catch (transferError) {
                console.warn('⚠️ Estratégia de transferência falhou:', transferError.message);
            }
            
            // Estratégia 3: Fallback sem device_id
            console.log('🎯 Tentativa 3: Reprodução sem especificar dispositivo');
            try {
                await this.makeRequest('/me/player/play', {
                    method: 'PUT',
                    body: JSON.stringify({
                        uris: uris
                    })
                });
                console.log('✅ Reprodução sem device_id bem-sucedida!');
                return; // Sucesso na estratégia 3
            } catch (fallbackError) {
                console.warn('⚠️ Estratégia 3 (sem device_id) falhou:', fallbackError.message);
                
                // Agora sim, todas as estratégias falharam
                console.error('❌ Todas as estratégias de reprodução falharam');
                
                // Adiciona informações de diagnóstico ao erro
                const diagnosticError = new Error('Todas as estratégias de reprodução falharam');
                diagnosticError.premiumStatus = await this.checkPremiumStatus().catch(() => null);
                diagnosticError.recentPlayback = await this.checkRecentPlayback().catch(() => null);
                diagnosticError.originalError = fallbackError;
                
                throw diagnosticError;
            }
            
        } catch (error) {
            // Este catch só deve ser acionado se houver erro nas verificações iniciais
            console.error('❌ Erro nas verificações iniciais:', error);
            throw error;
        }
    }

    // Controles do player
    async pause() {
        try {
            const endpoint = this.device_id ? `/me/player/pause?device_id=${this.device_id}` : '/me/player/pause';
            await this.makeRequest(endpoint, { method: 'PUT' });
            console.log('⏸️ Música pausada com sucesso');
            return true;
        } catch (error) {
            console.warn('⚠️ Aviso ao pausar:', error.message);
            // Não relança o erro se for apenas um problema de parse JSON
            if (error.message.includes('Resposta inválida') || error.message.includes('JSON')) {
                console.log('⏸️ Comando de pause provavelmente executado (erro de parse ignorado)');
                return true;
            }
            throw error;
        }
    }

    async resume() {
        try {
            const endpoint = this.device_id ? `/me/player/play?device_id=${this.device_id}` : '/me/player/play';
            await this.makeRequest(endpoint, { method: 'PUT' });
            console.log('▶️ Música retomada com sucesso');
            return true;
        } catch (error) {
            console.warn('⚠️ Aviso ao retomar:', error.message);
            // Não relança o erro se for apenas um problema de parse JSON
            if (error.message.includes('Resposta inválida') || error.message.includes('JSON')) {
                console.log('▶️ Comando de play provavelmente executado (erro de parse ignorado)');
                return true;
            }
            throw error;
        }
    }

    async nextTrack() {
        try {
            const endpoint = this.device_id ? `/me/player/next?device_id=${this.device_id}` : '/me/player/next';
            await this.makeRequest(endpoint, { method: 'POST' });
            console.log('⏭️ Próxima música com sucesso');
            return true;
        } catch (error) {
            console.warn('⚠️ Aviso ao pular música:', error.message);
            // Não relança o erro se for apenas um problema de parse JSON
            if (error.message.includes('Resposta inválida') || error.message.includes('JSON')) {
                console.log('⏭️ Comando próxima música provavelmente executado (erro de parse ignorado)');
                return true;
            }
            throw error;
        }
    }

    async previousTrack() {
        try {
            const endpoint = this.device_id ? `/me/player/previous?device_id=${this.device_id}` : '/me/player/previous';
            await this.makeRequest(endpoint, { method: 'POST' });
            console.log('⏮️ Música anterior com sucesso');
            return true;
        } catch (error) {
            console.warn('⚠️ Aviso ao voltar música:', error.message);
            // Não relança o erro se for apenas um problema de parse JSON
            if (error.message.includes('Resposta inválida') || error.message.includes('JSON')) {
                console.log('⏮️ Comando música anterior provavelmente executado (erro de parse ignorado)');
                return true;
            }
            throw error;
        }
    }

    async setVolume(volume) {
        await this.makeRequest(`/me/player/volume?volume_percent=${volume}`, { method: 'PUT' });
    }

    // Força atualização do estado do player
    async forceUpdatePlayerUI() {
        try {
            if (this.player) {
                const state = await this.player.getCurrentState();
                if (state) {
                    this.updatePlayerUI(state);
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar UI do player:', error);
        }
    }

    // Atualiza a UI do player
    updatePlayerUI(state) {
        const track = state.track_window.current_track;
        const playButton = document.getElementById('play-button');
        const pauseButton = document.getElementById('pause-button');
        const trackInfo = document.getElementById('track-info');

        console.log('🔄 Atualizando UI do player:', {
            track: track.name,
            artist: track.artists[0].name,
            paused: state.paused
        });

        if (trackInfo) {
            trackInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem; color: white; justify-content: center;">
                    <img src="${track.album.images[0]?.url}" alt="${track.name}" style="width: 60px; height: 60px; border-radius: 5px;">
                    <div>
                        <div style="font-weight: bold; font-size: 1.1rem;">${track.name}</div>
                        <div style="color: #cda45e;">${track.artists.map(a => a.name).join(', ')}</div>
                        <div style="font-size: 0.9rem; color: #aaa;">${track.album.name}</div>
                    </div>
                </div>
            `;
        }

        // Atualiza botões separados baseado no estado
        if (state.paused) {
            if (playButton) playButton.style.display = 'flex';
            if (pauseButton) pauseButton.style.display = 'none';
            console.log('🎮 Mostrando botão PLAY');
        } else {
            if (playButton) playButton.style.display = 'none';
            if (pauseButton) pauseButton.style.display = 'flex';
            console.log('🎮 Mostrando botão PAUSE');
        }
    }

    // Cria playlist personalizada baseada no humor
    async createMoodPlaylist(mood, genres) {
        try {
            console.log(`🎵 Criando playlist para humor: "${mood}" e gêneros: [${genres.join(', ')}]`);
            
            const searchResults = await this.searchByMoodAndGenre(mood, genres, 30);
            
            if (!searchResults || !searchResults.tracks || !searchResults.tracks.items) {
                throw new Error('Resposta inválida da API do Spotify');
            }
            
            if (searchResults.tracks.items.length === 0) {
                console.warn('Nenhuma música encontrada, tentando busca mais ampla...');
                
                // Tentativa final com busca muito ampla
                const fallbackResult = await this.makeRequest(`/search?q=${encodeURIComponent('música brasileira')}&type=track&limit=20&market=BR`);
                
                if (fallbackResult.tracks.items.length === 0) {
                    throw new Error('Nenhuma música encontrada mesmo com busca ampla');
                }
                
                const trackUris = fallbackResult.tracks.items.map(track => track.uri);
                
                // Criar playlist real no Spotify
                const createdPlaylist = await this.createSpotifyPlaylist(mood, genres, fallbackResult.tracks.items);
                
                return {
                    tracks: fallbackResult.tracks.items,
                    uris: trackUris,
                    spotifyPlaylist: createdPlaylist
                };
            }

            const trackUris = searchResults.tracks.items.map(track => track.uri);
            console.log(`✅ Playlist criada com ${searchResults.tracks.items.length} músicas`);
            
            // Criar playlist real no Spotify
            const createdPlaylist = await this.createSpotifyPlaylist(mood, genres, searchResults.tracks.items);
            
            return {
                tracks: searchResults.tracks.items,
                uris: trackUris,
                spotifyPlaylist: createdPlaylist
            };
        } catch (error) {
            console.error('❌ Erro ao criar playlist:', error);
            throw error;
        }
    }

    // Cria uma playlist real no Spotify
    async createSpotifyPlaylist(mood, genres, tracks) {
        try {
            // Obter informações do usuário
            const user = await this.makeRequest('/me');
            
            // Criar nome da playlist
            const playlistName = `Moodify: ${mood} • ${genres.join(' & ')}`;
            const playlistDescription = `Playlist personalizada criada pelo Moodify para seu humor "${mood}" com ${genres.join(', ')}. Gerada em ${new Date().toLocaleDateString('pt-BR')}.`;
            
            // Criar a playlist
            const playlist = await this.makeRequest(`/users/${user.id}/playlists`, {
                method: 'POST',
                body: JSON.stringify({
                    name: playlistName,
                    description: playlistDescription,
                    public: false
                })
            });
            
            console.log('✅ Playlist criada no Spotify:', playlist.name, '- ID:', playlist.id);
            
            // Adicionar músicas à playlist (máximo 100 por vez)
            const trackUris = tracks.slice(0, 50).map(track => track.uri); // Limitando a 50 para evitar problemas
            
            if (trackUris.length > 0) {
                await this.makeRequest(`/playlists/${playlist.id}/tracks`, {
                    method: 'POST',
                    body: JSON.stringify({
                        uris: trackUris
                    })
                });
                
                console.log(`✅ ${trackUris.length} músicas adicionadas à playlist`);
            }
            
            return {
                id: playlist.id,
                name: playlist.name,
                url: playlist.external_urls.spotify,
                uri: playlist.uri
            };
            
        } catch (error) {
            console.error('❌ Erro ao criar playlist no Spotify:', error);
            // Retorna null se não conseguir criar a playlist, mas não quebra o fluxo
            return null;
        }
    }

    // Obter informações do usuário atual
    async getCurrentUser() {
        return await this.makeRequest('/me');
    }

    // Verifica se o usuário tem Spotify Premium
    async checkPremiumStatus() {
        try {
            const user = await this.getCurrentUser();
            console.log('📊 Usuário:', user.display_name);
            console.log('💎 Tipo de conta:', user.product);
            console.log('🌍 País:', user.country);
            
            return {
                hasPremium: user.product === 'premium',
                product: user.product,
                country: user.country,
                displayName: user.display_name
            };
        } catch (error) {
            console.error('❌ Erro ao verificar status Premium:', error);
            return { hasPremium: false, error: error.message };
        }
    }

    // Verifica se há reprodução ativa recente
    async checkRecentPlayback() {
        try {
            const recentTracks = await this.makeRequest('/me/player/recently-played?limit=1');
            if (recentTracks.items && recentTracks.items.length > 0) {
                const lastPlayed = recentTracks.items[0];
                const playedAt = new Date(lastPlayed.played_at);
                const now = new Date();
                const hoursSinceLastPlay = (now - playedAt) / (1000 * 60 * 60);
                
                console.log('🎵 Última música tocada:', lastPlayed.track.name);
                console.log('⏰ Há', Math.round(hoursSinceLastPlay), 'horas');
                
                return {
                    hasRecentPlayback: hoursSinceLastPlay < 24,
                    lastTrack: lastPlayed.track.name,
                    hoursAgo: Math.round(hoursSinceLastPlay)
                };
            }
            
            return { hasRecentPlayback: false };
        } catch (error) {
            console.warn('⚠️ Não foi possível verificar reprodução recente:', error);
            return { hasRecentPlayback: false, error: error.message };
        }
    }

    // Obter dispositivos disponíveis
    async getAvailableDevices() {
        try {
            const devices = await this.makeRequest('/me/player/devices');
            console.log('📱 Dispositivos disponíveis:', devices.devices);
            return devices.devices;
        } catch (error) {
            console.error('❌ Erro ao obter dispositivos:', error);
            return [];
        }
    }

    // Verificar se há um dispositivo ativo
    async getActiveDevice() {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player', {
                headers: {
                    'Authorization': `Bearer ${this.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 404) {
                console.log('📴 Nenhum player ativo');
                return null;
            }

            if (response.status === 204) {
                console.log('📴 Player inativo (204)');
                return null;
            }

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }

            const text = await response.text();
            if (!text) {
                console.log('📴 Resposta vazia do player');
                return null;
            }

            const playerState = JSON.parse(text);
            if (playerState && playerState.device) {
                console.log('🎵 Dispositivo ativo:', playerState.device.name, '- ID:', playerState.device.id);
                return playerState.device;
            }
            
            console.log('📴 Nenhum dispositivo ativo encontrado');
            return null;
        } catch (error) {
            console.error('❌ Erro ao verificar dispositivo ativo:', error);
            return null;
        }
    }
}

// Instância global do Spotify
const spotify = new SpotifyAPI(); 