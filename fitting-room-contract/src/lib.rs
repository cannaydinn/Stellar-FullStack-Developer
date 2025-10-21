#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, Vec};

#[derive(Clone)]
#[contract]
pub struct FittingRoom;

#[contractimpl]
impl FittingRoom {
    /// Kullanıcının bir kıyafeti denemesini simüle eder
    pub fn try_clothes(env: Env, user: Address, clothing_id: i32) -> bool {
        // Kullanıcının yetkisini kontrol et
        user.require_auth();

        // Kullanıcının deneme geçmişini al veya yeni oluştur
        let mut history = Self::get_user_history(env.clone(), user.clone());
        
        // Kıyafeti geçmişe ekle
        history.push_back(clothing_id);
        
        // Geçmişi kaydet
        env.storage().persistent().set(&user, &history);
        
        true
    }

    /// Kullanıcının denediği kıyafetlerin listesini döndürür
    pub fn get_user_history(env: Env, user: Address) -> Vec<i32> {
        env.storage().persistent().get(&user).unwrap_or(Vec::new(&env))
    }

    /// Kullanıcının beğendiği kıyafeti kaydeder
    pub fn favorite_clothing(env: Env, user: Address, clothing_id: i32) -> bool {
        // Kullanıcının yetkisini kontrol et
        user.require_auth();

        // Favorileri al veya yeni oluştur
        let favorites_key = (user.clone(), "favorites");
        let mut favorites: Vec<i32> = env.storage()
            .persistent()
            .get(&favorites_key)
            .unwrap_or(Vec::new(&env));

        // Eğer zaten favorilerde değilse ekle
        if !favorites.contains(&clothing_id) {
            favorites.push_back(clothing_id);
            env.storage().persistent().set(&favorites_key, &favorites);
        }

        true
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::{Address as _};

    #[test]
    fn test_try_clothes() {
        let env = Env::default();
        let contract_id = env.register(FittingRoom {}, ());
        let client = FittingRoomClient::new(&env, &contract_id);
        let user = Address::generate(&env);

        // Kullanıcı yetkilendirmesi
        env.mock_all_auths();

        // Kıyafet deneme
        assert!(client.try_clothes(&user, &1));
        
        // Geçmişi kontrol et
        let history = client.get_user_history(&user);
        assert_eq!(history.len(), 1);
        assert_eq!(history.get(0), Some(1));
    }

    #[test]
    fn test_favorite_clothing() {
        let env = Env::default();
        let contract_id = env.register(FittingRoom {}, ());
        let client = FittingRoomClient::new(&env, &contract_id);
        let user = Address::generate(&env);

        // Kullanıcı yetkilendirmesi
        env.mock_all_auths();

        // Kıyafeti favorile
        assert!(client.favorite_clothing(&user, &1));
        
        // Favori listesini kontrol et
        env.as_contract(&contract_id, || {
            let favorites_key = (user.clone(), "favorites");
            let favorites: Vec<i32> = env.storage().persistent().get(&favorites_key).unwrap();
            assert_eq!(favorites.len(), 1);
            assert_eq!(favorites.get(0), Some(1));
        });
    }
}